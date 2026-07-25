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

  addLike(idFilm: number, nutzer: string): Observable<any> {
    return this.http.put(`/api/movies/${idFilm}/like/${nutzer}`, {nutzer});
  }

  removeLike(idFilm: number, nutzer: string): Observable<any> {
    return this.http.delete(`/api/movies/${idFilm}/like/${nutzer}`);
  }

  hasUserLikedFilm(idFilm: number, nutzer: string): Observable<LikeInterface> {
    return this.http.get<{ anzahl_likes: number }>(`/api/movies/likes/${idFilm}/${nutzer}`).pipe(
      map(response => ({ isLiked: response.anzahl_likes > 0 }))
    );
  }
}

