import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Test} from './test/test';
import {Datum} from './datum/datum';
import {HeaderComponent} from './header-component/header-component';
import {FooterComponent} from './footer-component/footer-component';

@Component({
  selector: 'app-root',
  imports: [Test, Datum, RouterOutlet, RouterLinkActive, RouterLink, HeaderComponent, FooterComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Datenbanken');
}
