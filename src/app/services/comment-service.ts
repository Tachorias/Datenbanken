import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CommentCardInterface} from '../movie-view/comment-card-component/comment-card.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}

  addKommentar(comment: CommentCardInterface): Observable<CommentCardInterface> {
    return this.http.post<CommentCardInterface>('api/movies/kommentar', comment);
  }

  getKommentare(movieId: number): Observable<CommentCardInterface[]> {
    return this.http.get<CommentCardInterface[]>('api/movies/kommentare/' + movieId);
  }
}
