import { Component } from '@angular/core';
import { KategorienFilterComponent } from './kategorien-filter-component/kategorien-filter-component';
import { KategorienFilmGridComponent } from './kategorien-film-grid-component/kategorien-film-grid-component';

/*// Konfiguriert die K-Hauptkomponente*/
@Component({
  selector: 'app-kategorien-component',
  imports: [KategorienFilterComponent, KategorienFilmGridComponent],
  templateUrl: './kategorien-component.html',
  styleUrl: './kategorien-component.css',
})

/*// Speichert Sortierung und Kategorienauswahl*/
export class KategorienComponent {
  sortierung = 'neu';
  ausgewaehlteKategorien: number[] = [];
}
