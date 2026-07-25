import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MovieCardInterface} from '../homePageComponent/movie-card/movie-card.interface';
import { map, Observable } from 'rxjs';
import { LikeInterface } from '../movie-view/like.interface';

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
  addAufruf(idFilm: number): Observable<any> {
    return this.http.post(`/api/movies/addAufruf/${idFilm}`, {});
  }

  addLike(idFilm: number, nutzer: string): Observable<any> {
    return this.http.post(`/api/movies/addLike/${idFilm}/${nutzer}`, {nutzer});
  }

  removeLike(idFilm: number, nutzer: string): Observable<any> {
    return this.http.delete(`/api/movies/removeLike/${idFilm}/${nutzer}`);
  }

  hasUserLikedFilm(idFilm: number, nutzer: string): Observable<LikeInterface> {
    return this.http.get<{ anzahl_likes: number }[]>(`/api/movies/likes/${idFilm}/${nutzer}`).pipe(
      map(response => ({ isLiked: response[0].anzahl_likes == 1 }))
    );
  }
}

