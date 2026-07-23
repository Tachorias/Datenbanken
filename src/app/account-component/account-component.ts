import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.html',
  styleUrl: './account-component.css',
})
export class AccountComponent implements OnInit {

  benutzername: string | null = null;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.authService.getAktuellerUser()
      .subscribe({

        next: (user) => {

          this.benutzername = user.Benutzername;

        },

        error: () => {

          this.router.navigate(['/login']);

        }

      });

  }


  abmelden(): void {

    this.authService.logout()
      .subscribe(() => {

        this.router.navigate(['/login']);

      });

  }

}
