import { Component, inject, OnInit } from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import { MovieCardInterface } from '../homePageComponent/movie-card/movie-card.interface';
import {CommentGridComponent} from './comment-grid-component/comment-grid-component';
import {ActivatedRoute, ActivatedRouteSnapshot, RouterLink} from '@angular/router';
import { FilmeService } from '../services/filme-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.html',
  styleUrl: './movie-view.css',
  imports: [CommentGridComponent, AsyncPipe, DatePipe, RouterLink],
})
export class MovieView implements OnInit {
  readonly movieURL: string;
  private route = inject(ActivatedRoute);
  movie$!: Observable<MovieCardInterface>;
  private filmeService: FilmeService;

  constructor() {
    this.filmeService = inject(FilmeService);
    this.movieURL = this.route.snapshot.paramMap.get('id') || '';
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url, // https://www.angular.dev
      params: snapshot.params,
      queryParams: snapshot.queryParams, // Query parameters
    });
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movie$ = this.filmeService.getFilm(id);
    this.movie$.subscribe(movie => console.log(movie));
  }
}
