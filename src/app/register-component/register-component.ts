import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {

  benutzername = '';
  passwort = '';

  rolle = 'nutzer';

  anzeigename = '';
  studiengang = '';
  email = '';

  fehlermeldung = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrieren() {

    this.authService.register(
      this.benutzername,
      this.passwort,
      this.rolle,
      this.anzeigename,
      this.studiengang,
      this.email
    ).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.fehlermeldung = err.error.message;
      }
    });

  }

}
