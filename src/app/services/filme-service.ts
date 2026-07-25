import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MovieCardInterface} from '../homePageComponent/movie-card/movie-card.interface';
import { map, Observable } from 'rxjs';
import { CommentCardInterface } from '../movie-view/comment-card-component/comment-card.interface';

@Injectable({providedIn: 'root'})
export class FilmeService {
  private http = inject(HttpClient);

  getAlleFilme() {
    return this.http.get('/api/movies');
  }

  getFilmeSortiert(sortierung: string):Observable<MovieCardInterface[]> {
    return this.http.get<MovieCardInterface[]>(`/api/movies/${sortierung}`);
  }

  getFilm(id: number): Observable<MovieCardInterface> {
    return this.http
      .get<MovieCardInterface[]>(`/api/movies/search/${id}`)
      .pipe(map(movies => movies[0]));
  }

  getKommentare(id: number): Observable<CommentCardInterface[]> {
    return this.http.get<CommentCardInterface[]>(`/api/movies/kommentare/${id}`);
  }

  getMeineFilme(): Observable<MovieCardInterface[]> {
    return this.http.get<MovieCardInterface[]>('/api/movies/meine');
  }

// Welche Datei meinst du genau
  getFilmeNachKategorien(
    kategorieIds: number[],
    sortierung: string,
    suchtext: string
  ): Observable<MovieCardInterface[]> {
    return this.http.get<MovieCardInterface[]>(
      '/api/movies/filter/kategorien',
      {
        params: {
          ids: kategorieIds.join(','),
          sortierung: sortierung,
          suche: suchtext,
        }
      }
    );
  }

}

