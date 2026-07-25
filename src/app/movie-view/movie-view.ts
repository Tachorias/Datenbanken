import { Component, effect, inject, OnInit, PLATFORM_ID, DestroyRef, signal } from '@angular/core';
import { AsyncPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { MovieCardInterface } from '../homePageComponent/movie-card/movie-card.interface';
import {CommentGridComponent} from './comment-grid-component/comment-grid-component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { FilmeService } from '../services/filme-service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LikeInterface } from './like.interface';
import { WebSocketService } from '../services/websocket-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.html',
  styleUrl: './movie-view.css',
  imports: [CommentGridComponent, AsyncPipe, DatePipe, RouterLink],
})
export class MovieView implements OnInit {
  readonly movieURL: string;
  private route = inject(ActivatedRoute);
  movie$!: Observable<MovieCardInterface>;
  likes = signal<number>(0);
  aufrufe = signal<number>(0);
  kommentare =  signal<number>(0);
  private filmeService = inject(FilmeService);
  public authService = inject(AuthService);
  isLiked$!: Observable<LikeInterface>;
  private platformId = inject(PLATFORM_ID);
  private wsService = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.movieURL = this.route.snapshot.paramMap.get('id') || '';
    effect(() => {
      if (!this.authService.isLoggedIn()) {
        return;
      }
      console.log("Benutzer ist eingeloggt:", this.authService.currentUsername());

      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.isLiked$ = this.filmeService.hasUserLikedFilm(
        id,
        this.authService.currentUsername()!
      );
      this.isLiked$.subscribe(isLiked => {
        console.log(`Hat der Benutzer den Film mit ID ${id} geliked?`, isLiked.isLiked);
      });
    });
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.wsService.connect();

    this.wsService.film$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((msg) => {
      const film = this.filmeService.getFilm(id);
      switch (msg.type) {
        case 'kommentar':
          film.subscribe(movie => {this.kommentare.set(movie.idFilme)});
          console.log('Neuer Kommentar empfangen:', msg.payload);
          break;
        case 'system':
          console.log('Systemnachricht empfangen:', msg.payload);
          break;
        default:
          console.log('Update empfangen:', msg);
          if (msg.payload.filmId === id) {
            console.log(id, msg.payload.filmId);
            film.subscribe(movie => {this.likes.set(movie.Likes);this.aufrufe.set(movie.Aufrufe)});
          }
          break;
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.filmeService.addAufruf(id).subscribe({
        next: () => console.log('Aufruf gespeichert'),
        error: err => console.error(err)
      });
    }

    this.movie$ = this.filmeService.getFilm(id);
    this.movie$.subscribe(movie => {this.likes.set(movie.Likes);this.aufrufe.set(movie.Aufrufe); this.kommentare.set(movie.idFilme)});
    this.wsService.sendUpdate({ type: 'aufrufe', payload: { filmId: id } });
  }

  unlikeMovie(movie: MovieCardInterface): void {
    this.filmeService.removeLike(movie.idFilme, String(this.authService.currentUsername())).subscribe(
      () => console.log('Like erfolgreich entfernt'),
      error => console.error('Fehler beim Entfernen des Likes', error)
    );
    this.isLiked$ = this.filmeService.hasUserLikedFilm(
      movie.idFilme,
      this.authService.currentUsername()!
    );
    movie.Likes--;
    this.wsService.sendUpdate({ type: 'like', payload: { filmId: movie.idFilme } });
  }

  likeMovie(movie: MovieCardInterface): void {

    this.filmeService.addLike(movie.idFilme, String(this.authService.currentUsername())).subscribe(
      () => console.log('Like erfolgreich hinzugefügt'),
      error => console.error('Fehler beim Hinzufügen des Likes', error)
    );
    this.isLiked$ = this.filmeService.hasUserLikedFilm(
      movie.idFilme,
      this.authService.currentUsername()!
    );
    movie.Likes++;
    this.wsService.sendUpdate({ type: 'like', payload: { filmId: movie.idFilme } });
  }
}
