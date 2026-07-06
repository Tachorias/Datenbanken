import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MovieCardInterface} from '../homePageComponent/movie-card/movie-card.interface';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FilmeService {
  private http = inject(HttpClient);

  getAlleFilme() {
    return this.http.get('/api/movies');
  }

  getFilmeSortiert(sortierung: string):Observable<MovieCardInterface[]> {
    return this.http.get<MovieCardInterface[]>(`/api/movies/${sortierung}`);
  }

  getFilm(id: number) {
    return this.http.get(`/api/movies/${id}`);
  }

}

