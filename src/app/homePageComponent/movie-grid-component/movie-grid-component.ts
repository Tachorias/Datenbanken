import { Component } from '@angular/core';
import { MovieRow } from '../movie-row/movie-row';

@Component({
  selector: 'app-movie-grid-component',
  imports: [MovieRow],
  templateUrl: './movie-grid-component.html',
  styleUrl: './movie-grid-component.css',
})
export class MovieGridComponent {}
