import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  benutzername = '';
  passwort = '';
  fehlermeldung = '';
  zeigeRegister = false;
  registerBenutzername = '';
  registerPasswort = '';

  constructor(
    private authService: AuthService,
    private router: Router,


  ) {}

  anmelden(): void {
    const loginErfolgreich = this.authService.login(
      this.benutzername,
      this.passwort
    );

    if (loginErfolgreich) {
      this.fehlermeldung = '';
      this.router.navigate(['/account']);
    } else {
      this.fehlermeldung = 'Benutzername oder Passwort ist falsch.';
    }
  }
  registrieren(): void {
    const erfolg = this.authService.register(
      this.registerBenutzername,
      this.registerPasswort
    );

    if (erfolg) {
      this.fehlermeldung = '';
      this.zeigeRegister = false;
    } else {
      this.fehlermeldung = 'Registrierung fehlgeschlagen.';
    }
  }


}



//import { Component } from '@angular/core';
//@Component({
//  selector: 'app-login-component',
//  imports: [],
//  templateUrl: './login-component.html',
//  styleUrl: './login-component.css',
//})
//export class LoginComponent {
//}
