import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-account-component',
  imports: [],
  templateUrl: './account-component.html',
  styleUrl: './account-component.css',
})
export class AccountComponent implements OnInit {

  // Vorläufiger Benutzername
  // Später kommt dieser Wert aus der Datenbank
  benutzername = 'tim';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Falls der Nutzer nicht eingeloggt ist,
    // wird er zurück zur Login-Seite geschickt
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  abmelden(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
