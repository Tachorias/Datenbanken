import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-nav-bar-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav-bar-component.html',
  styleUrl: './nav-bar-component.css',
})
export class NavBarComponent implements OnInit {

  eingeloggt = false;


  constructor(
    private authService: AuthService
  ) {}


  ngOnInit(): void {

    this.authService.getAktuellerUser()
      .subscribe({

        next: () => {
          this.eingeloggt = true;
        },

        error: () => {
          this.eingeloggt = false;
        }

      });

  }

}
