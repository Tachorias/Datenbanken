import { Component, Input } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';


@Component({
  selector: 'app-movie-row',
  imports: [MovieCard],
  templateUrl: './movie-row.html',
  styleUrl: './movie-row.css',
})
export class MovieRow {
  @Input() daten!:{
    kategorie: string,
    anzahl: number,
  }
}
