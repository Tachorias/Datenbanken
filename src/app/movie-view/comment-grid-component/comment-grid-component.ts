import { Component, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { CommentCardComponent } from '../comment-card-component/comment-card-component';
import { Observable, Subscription } from 'rxjs';
import { FilmeService } from '../../services/filme-service';
import { CommentCardInterface } from '../comment-card-component/comment-card.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-comment-grid-component',
  standalone: true,
  imports: [CommentCardComponent, AsyncPipe],
  templateUrl: './comment-grid-component.html',
  styleUrls: ['./comment-grid-component.css'],
})
export class CommentGridComponent implements OnChanges, OnDestroy {
  @Input() idFilm!: number;
  kommentare$!: Observable<CommentCardInterface[]>;
  private sub?: Subscription;

  constructor(private filmService: FilmeService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idFilm'] && this.idFilm) {
      this.ladeKommentare();
    }
  }

  ladeKommentare(): void {
    if (!this.idFilm) return;
    this.kommentare$ = this.filmService.getKommentare(this.idFilm);
    this.sub?.unsubscribe();
    this.sub = this.kommentare$.subscribe((kommentare) => {})
    console.log(this.kommentare$);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
