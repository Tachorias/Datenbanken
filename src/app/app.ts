import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Test} from './test/test';
import {Datum } from './datum/datum';



@Component({
  selector: 'app-root',
  imports: [Test, Datum],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Datenbanken');
}
