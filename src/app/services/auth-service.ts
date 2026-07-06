import { Injectable } from '@angular/core';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private speicherSchluessel = 'token';
  private userKey = 'users';

  // 🧠 lädt User aus localStorage
  private getUsers(): User[] {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : [];
  }

  // 💾 speichert User in localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.userKey, JSON.stringify(users));
  }

  login(benutzername: string, passwort: string): boolean {
    const users = this.getUsers();

    const cleanUsername = benutzername.trim();
    const cleanPassword = passwort.trim();

    const user = users.find(
      u =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() &&
        u.password === cleanPassword
    );

    if (user) {
      localStorage.setItem(this.speicherSchluessel, cleanUsername);
      return true;
    }

    return false;
  }

  register(benutzername: string, passwort: string): boolean {
    const users = this.getUsers();

    const cleanUsername = benutzername.trim();
    const cleanPassword = passwort.trim();

    if (!cleanUsername || !cleanPassword) return false;

    const exists = users.find(
      u => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (exists) return false;

    users.push({
      username: cleanUsername,
      password: cleanPassword
    });

    this.saveUsers(users);
    return true;
  }


  // 👀 prüfen ob eingeloggt
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.speicherSchluessel);
  }

  // 🚪 logout
  logout(): void {
    localStorage.removeItem(this.speicherSchluessel);
  }

  // 👤 aktueller User
  getUser(): string | null {
    return localStorage.getItem(this.speicherSchluessel);
  }
}
