import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { KategorienFilmInterface } from '../kategorien-film.interface';

/*// Konfiguriert die Angular-Komponente*/
@Component({
  selector: 'app-kategorien-film-card-component',
  imports: [],
  templateUrl: './kategorien-film-card-component.html',
  styleUrl: './kategorien-film-card-component.css',
})

/*// Öffnet den ausgewählten Film*/
export class KategorienFilmCardComponent {
  @Input() film!: KategorienFilmInterface;
  constructor(private router: Router) {}
  openMovie(): void {
    this.router.navigate(['/movie'], { state: { movie: this.film } });
  }

}
