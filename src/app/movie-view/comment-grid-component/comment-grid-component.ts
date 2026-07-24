import { Component, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { CommentCardComponent } from '../comment-card-component/comment-card-component';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { CommentCardInterface } from '../comment-card-component/comment-card.interface';
import { AsyncPipe } from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {FormsModule} from '@angular/forms';
import {CommentService} from '../../services/comment-service';

@Component({
  selector: 'app-comment-grid-component',
  standalone: true,
  imports: [CommentCardComponent, AsyncPipe,FormsModule],
  templateUrl: './comment-grid-component.html',
  styleUrls: ['./comment-grid-component.css'],
})
export class CommentGridComponent implements OnChanges, OnDestroy {
  @Input() idFilm!: number;
  kommentare$!: Observable<CommentCardInterface[]>;
  private sub?: Subscription;
  inhalt = "";

  constructor(private commentService: CommentService, public authService: AuthService) {}

  async kommentarSchreiben(){
    if (!this.inhalt.trim()) {
      return;
    }

    const kommentar: CommentCardInterface = {
      Verfasser: String(this.authService.currentUsername),
      Inhalt: this.inhalt,
      idFilm: this.idFilm,
      Datum: String(new Date())
    };

    this.inhalt = '';
    try {
      await firstValueFrom(this.commentService.addKommentar(kommentar));
      this.ladeKommentare();
    } catch (error) {
      console.error('Fehler beim Speichern des Kommentars:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idFilm'] && this.idFilm) {
      this.ladeKommentare();
    }
  }

  ladeKommentare(): void {
    if (!this.idFilm) return;
    this.kommentare$ = this.commentService.getKommentare(this.idFilm);
    this.sub?.unsubscribe();
    this.sub = this.kommentare$.subscribe(() => {})
    console.log(this.kommentare$);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
