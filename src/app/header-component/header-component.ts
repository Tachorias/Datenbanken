import { Component } from '@angular/core';
import {NavBarComponent} from '../nav-bar-component/nav-bar-component';

@Component({
  selector: 'app-header-component',
  imports: [
    NavBarComponent
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {}
