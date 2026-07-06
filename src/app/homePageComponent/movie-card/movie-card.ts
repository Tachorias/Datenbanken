import { Component, Input } from '@angular/core';
import {MovieCardInterface} from "./movie-card.interface";


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
}
