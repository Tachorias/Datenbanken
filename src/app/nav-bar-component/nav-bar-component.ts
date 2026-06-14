import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-nav-bar-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav-bar-component.html',
  styleUrl: './nav-bar-component.css',
})
export class NavBarComponent {
  constructor(public authService: AuthService) {}
}
