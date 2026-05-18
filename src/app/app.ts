import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DatumComponent, Test} from './test/test';

@Component({
  selector: 'app-root',
  imports: [Test],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Datenbanken');
}
