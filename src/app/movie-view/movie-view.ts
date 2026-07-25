import { Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AsyncPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { MovieCardInterface } from '../homePageComponent/movie-card/movie-card.interface';
import {CommentGridComponent} from './comment-grid-component/comment-grid-component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { FilmeService } from '../services/filme-service';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LikeInterface } from './like.interface';

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
  private filmeService= inject(FilmeService);
  public authService= inject(AuthService);
  isLiked$!: Observable<LikeInterface>;
  private platformId = inject(PLATFORM_ID);


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

    if (isPlatformBrowser(this.platformId)) {
      this.filmeService.addAufruf(id).subscribe({
        next: () => console.log('Aufruf gespeichert'),
        error: err => console.error(err)
      });
    }

    this.movie$ = this.filmeService.getFilm(id);
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
  }
}
