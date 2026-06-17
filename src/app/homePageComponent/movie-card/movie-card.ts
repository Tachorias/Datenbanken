import { Component, Input } from '@angular/core';

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
  @Input() movie!:{
    title: string;
    image: string;
    description: string;
  }
}
