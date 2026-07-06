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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.benutzername = this.authService.getUser();
  }

  abmelden(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
