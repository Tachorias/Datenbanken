import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ProduzentInterface } from '../account-component/produzent.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  // Signals
  isLoggedIn = signal(false);
  currentUsername = signal<string | null>(null);
  istProduzent = signal(false);

  constructor() {

    this.checkLogin().subscribe({

      next: (res) => {
        console.log("User Antwort:", res);
        this.isLoggedIn.set(true);
        this.currentUsername.set(res.username);
        this.istProduzent.set(res.istProduzent);
      },

      error: () => {
        this.isLoggedIn.set(false);
        this.currentUsername.set(null);
        this.istProduzent.set(false);
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
        console.log("Login Response:", res);
        this.isLoggedIn.set(true);
        this.currentUsername.set(res.username);
        this.istProduzent.set(res.istProduzent);
        console.log(
          "Signal nach setzen:",
          this.istProduzent()
        );
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

  getProduzent(){

    return this.http.get<any>(
      '/api/produzent',
      {
        withCredentials:true
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
        this.istProduzent.set(false);
      })
    );
  }

  register(
    username: string,
    password: string,
    rolle: string,
    anzeigename: string,
    studiengang: string,
    email: string
  ) {

    return this.http.post<any>(
      '/api/register',
      {
        username,
        password,
        rolle,
        anzeigename,
        studiengang,
        email
      }
    );

  }
}
