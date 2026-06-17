import { Component } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-grid-component',
  imports: [MovieCard],
  templateUrl: './movie-grid-component.html',
  styleUrl: './movie-grid-component.css',
})
export class MovieGridComponent {

}
