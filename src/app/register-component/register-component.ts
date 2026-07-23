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

  fehlermeldung = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrieren() {

    this.authService.register(this.benutzername, this.passwort).subscribe({

      next: () => {

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.fehlermeldung = err.error.message;

      }

    });

  }

}
