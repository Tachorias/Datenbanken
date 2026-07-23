import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  // Signals
  isLoggedIn = signal(false);
  currentUsername = signal<string | null>(null);

  constructor() {
    // Beim Start der App prüfen, ob bereits eine Session existiert
    this.checkLogin().subscribe({
      next: (res) => {
        this.isLoggedIn.set(true);
        this.currentUsername.set(res.username);
      },
      error: () => {
        this.isLoggedIn.set(false);
        this.currentUsername.set(null);
      }
    });
  }

  login(username: string, password: string) {
    return this.http.post<any>(
      '/api/login',
      {
        username,
        password
      },
      {
        withCredentials: true
      }
    ).pipe(
      tap((res) => {
        this.isLoggedIn.set(true);
        this.currentUsername.set(res.username);
      })
    );
  }

  checkLogin() {
    return this.http.get<any>(
      '/api/user',
      {
        withCredentials: true
      }
    );
  }

  getAktuellerUser() {
    return this.http.get<any>(
      '/api/user',
      {
        withCredentials: true
      }
    );
  }

  logout() {
    return this.http.post(
      '/api/logout',
      {},
      {
        withCredentials: true
      }
    ).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.currentUsername.set(null);
      })
    );
  }

  register(username: string, password: string) {
    return this.http.post<any>(
      '/api/register',
      {
        username,
        password
      }
    );
  }
}
