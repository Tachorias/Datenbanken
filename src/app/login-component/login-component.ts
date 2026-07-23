import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  benutzername = '';
  passwort = '';
  fehlermeldung = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async anmelden() {

    this.fehlermeldung = '';

    if (!this.benutzername || !this.passwort) {
      this.fehlermeldung = 'Bitte Benutzername und Passwort eingeben';
      return;
    }

    try {

      const result = await firstValueFrom(
        this.authService.login(
          this.benutzername,
          this.passwort
        )
      );

      console.log("Login erfolgreich", result);

      this.fehlermeldung = result.message;

      this.router.navigate(['/account']);

    } catch (err: any) {

      console.error("Login fehlgeschlagen:", err);

      if (err.error?.message) {
        this.fehlermeldung = err.error.message;
      } else {
        this.fehlermeldung = 'Login fehlgeschlagen';
      }

    }
  }
}
