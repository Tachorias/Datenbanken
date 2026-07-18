import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieCardInterface } from "./movie-card.interface";


@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input() cardSize!:{
    width: number;
  }
  @Input() movie!: MovieCardInterface;

  constructor(private router: Router) {}

  openMovie() {
    this.router.navigate(['/movie'], { state: { movie: this.movie } });
  }
}
