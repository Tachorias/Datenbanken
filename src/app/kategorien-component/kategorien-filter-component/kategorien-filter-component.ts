import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

/*// Definiert Aufbau einer Kategorie*/
interface Kategorie {
  idKategorie: number;
  Name: string;
}

/*// Konfiguriert die Filter-Komponente*/
@Component({
  selector: 'app-kategorien-filter-component',
  imports: [AsyncPipe],
  templateUrl: './kategorien-filter-component.html',
  styleUrl: './kategorien-filter-component.css',
})

/*// Speichert Sortierung, Auswahl und Kategorien*/
export class KategorienFilterComponent {
  @Input() sortierung = 'neu';
  @Output() sortierungChange = new EventEmitter<string>();
  @Input() ausgewaehlteKategorien: number[] = [];
  @Output() ausgewaehlteKategorienChange =
    new EventEmitter<number[]>();
  kategorien$: Observable<Kategorie[]>;

  /*// Lädt Kategorien vom Server*/
  constructor(private http: HttpClient) {
    this.kategorien$ =
      this.http.get<Kategorie[]>('/api/kategorien');
  }

  /*// Bestimmt Sliderposition*/
  get sliderWert(): number {
    return this.sortierung === 'neu' ? 0 : 1;
  }

  /*// Ändert Sortierung mit Slider*/
  sortierungAendern(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.sortierungChange.emit(
      input.value === '0' ? 'neu' : 'alt'
    );
  }

  /*// Schaltet Kategorien an oder aus*/
  kategorieUmschalten(idKategorie: number): void {
    if (this.ausgewaehlteKategorien.includes(idKategorie)) {
      this.ausgewaehlteKategorien =
        this.ausgewaehlteKategorien.filter(
          id => id !== idKategorie
        );
    } else {
      this.ausgewaehlteKategorien = [
        ...this.ausgewaehlteKategorien,
        idKategorie,
      ];
    }
    this.ausgewaehlteKategorienChange.emit(
      this.ausgewaehlteKategorien
    );
  }

  /*// Prüft ob Kategorie ausgewählt ist*/
  istAusgewaehlt(idKategorie: number): boolean {
    return this.ausgewaehlteKategorien.includes(idKategorie);
  }
}
