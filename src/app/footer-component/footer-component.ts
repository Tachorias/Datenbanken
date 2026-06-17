import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-footer-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent {}
