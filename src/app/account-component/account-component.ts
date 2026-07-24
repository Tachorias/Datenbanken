import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { AsyncPipe } from '@angular/common';
import { ProduzentInterface } from './produzent.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-component',
  templateUrl: './account-component.html',
  styleUrl: './account-component.css',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
})
export class AccountComponent implements OnInit {
  produzent$!: Observable<ProduzentInterface>;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  getInitial(): string {
    const username = this.authService.currentUsername();

    if (!username) {
      return '?';
    }

    return username.charAt(0).toUpperCase();
  }

  ngOnInit(): void {
    this.produzent$ = this.authService.getProduzent();
  }

  abmelden(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
