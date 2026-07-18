import { Component, OnInit } from '@angular/core';
import { MovieCardInterface } from '../homePageComponent/movie-card/movie-card.interface';

@Component({
  selector: 'app-movie-view',
  imports: [],
  templateUrl: './movie-view.html',
  styleUrl: './movie-view.css',
})
export class MovieView implements OnInit {
  movie?: MovieCardInterface;

  ngOnInit() {
    this.movie = (history && (history.state as any))?.movie;
  }
}
