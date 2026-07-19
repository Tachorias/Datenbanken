import { Component, OnInit } from '@angular/core';
import { MovieCardInterface } from '../homePageComponent/movie-card/movie-card.interface';
import { CommentCardComponent } from './comment-card-component/comment-card-component';
import {CommentGridComponent} from './comment-grid-component/comment-grid-component';

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.html',
  styleUrl: './movie-view.css',
  imports: [CommentGridComponent],
})
export class MovieView implements OnInit {
  movie?: MovieCardInterface;

  ngOnInit() {
    this.movie = (history && (history.state as any))?.movie;
  }
}
