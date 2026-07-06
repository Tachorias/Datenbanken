import { Injectable } from '@angular/core';

// Vorläufige Login-Daten
// Später kommen diese Daten aus der Datenbank
const vorlaeufigerBenutzername = 'tim';
const vorlaeufigesPasswort = '123';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Name des Eintrags im Browser-Speicher
  private speicherSchluessel = 'token';

  // Prüft, ob der Nutzer eingeloggt ist
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.speicherSchluessel);
  }

  // Versucht den Nutzer einzuloggen
  login(benutzername: string, passwort: string): boolean {

    // Prüft, ob Benutzername und Passwort stimmen
    if (
      benutzername === vorlaeufigerBenutzername &&
      passwort === vorlaeufigesPasswort
    ) {
      // Speichert einen vorläufigen Token im Browser
      localStorage.setItem(this.speicherSchluessel, 'angemeldet');

      // Login war erfolgreich
      return true;
    }

    // Login war nicht erfolgreich
    return false;
  }

  // Loggt den Nutzer wieder aus
  logout(): void {
    localStorage.removeItem(this.speicherSchluessel);
  }
}





//import { Injectable } from '@angular/core';
//@Injectable({
//  providedIn: 'root',
//})
//export class AuthService {
//  isLoggedIn(): boolean{
//    return !!localStorage.getItem('token');
//  }
//}
