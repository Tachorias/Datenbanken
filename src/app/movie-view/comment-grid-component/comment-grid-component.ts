import { Component, Input, SimpleChanges, OnChanges, OnDestroy, OnInit, inject, DestroyRef } from '@angular/core';
import { CommentCardComponent } from '../comment-card-component/comment-card-component';
import { Observable, Subscription, firstValueFrom, Subject } from 'rxjs';
import { CommentCardInterface } from '../comment-card-component/comment-card.interface';
import { AsyncPipe } from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {CommentService} from '../../services/comment-service';
import { WebSocketService } from '../../services/websocket-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, shareReplay, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-comment-grid-component',
  standalone: true,
  imports: [CommentCardComponent, AsyncPipe,FormsModule],
  templateUrl: './comment-grid-component.html',
  styleUrls: ['./comment-grid-component.css'],
})
export class CommentGridComponent implements OnInit, OnDestroy {
  @Input() idFilm!: number;
  kommentare$!: Observable<CommentCardInterface[]>;
  private reload$ = new Subject<void>();
  inhalt = "";
  private wsService = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);

  constructor(private commentService: CommentService, public authService: AuthService) {}

  async kommentarSchreiben(){
    if (!this.inhalt.trim()) {
      return;
    }

    const kommentar: CommentCardInterface = {
      Verfasser: String(this.authService.currentUsername()),
      Inhalt: this.inhalt,
      idFilm: this.idFilm,
      Datum: String(new Date())
    };

    this.inhalt = '';
    try {
      await firstValueFrom(this.commentService.addKommentar(kommentar));
      this.wsService.sendUpdate({ type: 'kommentar', payload: { filmId: this.idFilm } });
      this.reload$.next();
    } catch (error) {
      console.error('Fehler beim Speichern des Kommentars:', error);
    }
  }

  ngOnInit() {
    this.wsService.connect();

    this.kommentare$ = this.reload$.pipe(
      startWith(undefined),
      switchMap(() => this.commentService.getKommentare(this.idFilm)),
      shareReplay(1),
      takeUntilDestroyed(this.destroyRef)
    );

    this.wsService.film$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((msg) => {
      if (msg.type === 'kommentar' && msg.payload.filmId === this.idFilm) {
        console.log('Neuer Kommentar empfangen:', msg.payload);
        this.reload$.next();
      }
    });
    
    this.reload$.next();
  }

  ngOnDestroy() {
    this.reload$.complete();
  }
}
