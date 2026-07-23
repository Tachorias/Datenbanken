import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);


  login(username: string, password: string) {
    return this.http.post<any>(
      'api/login',
      {
        username,
        password
      },
      {
        withCredentials: true
      }
    );

  }


  getAktuellerUser(){

    return this.http.get<any>(
      '/api/user',
      {
        withCredentials: true
      }
    );

  }


  logout(){

    return this.http.post(
      '/api/logout',
      {},
      {
        withCredentials: true
      }
    );

  }

  register(username: string, password: string) {

    return this.http.post<any>('/api/register', {
      username,
      password
    });

  }

}
