import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { FilmeService } from "../../services/filme-service";
import { Observable, Subscription } from "rxjs";
import { MovieCardInterface } from "../movie-card/movie-card.interface";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-movie-row',
  imports: [MovieCard, AsyncPipe],
  templateUrl: './movie-row.html',
  styleUrl: './movie-row.css',
})
export class MovieRow implements OnChanges, OnDestroy {
  @Input() daten!: {
    kategorie: string,
    sortierung: string,
  }

  movies$!: Observable<MovieCardInterface[]>;
  private sub?: Subscription;
  private moviesLength = 0;

  startIndex = 0;
  itemsPerView = 4; // number of visible items

  constructor(private filmService: FilmeService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['daten'] && this.daten) {
      this.ladeFilme();
    }
  }

  ladeFilme() {
    if (!this.daten) return;
    this.movies$ = this.filmService.getFilmeSortiert(this.daten.sortierung);
    this.sub?.unsubscribe();
    this.sub = this.movies$.subscribe(movies => {
      this.moviesLength = (movies || []).length;
      // reset index if out of range
      if (this.startIndex >= this.moviesLength) this.startIndex = 0;
    });
  }

  next() {
    if (this.startIndex + this.itemsPerView < this.moviesLength) {
      this.startIndex++;
    }
  }

  prev() {
    if (this.startIndex > 0) {
      this.startIndex--;
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
