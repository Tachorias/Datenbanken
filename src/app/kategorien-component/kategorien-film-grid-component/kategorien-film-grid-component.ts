import { Component, Input, OnChanges } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FilmeService } from '../../services/filme-service';
import { KategorienFilmInterface } from '../kategorien-film.interface';
import { KategorienFilmCardComponent } from '../kategorien-film-card-component/kategorien-film-card-component';
import { KategorienSuchleisteComponent } from '../kategorien-suchleiste-component/kategorien-suchleiste-component';

/*// Konfiguriert Filmraster-Komponente mit Abhängigkeiten*/
@Component({
  selector: 'app-kategorien-film-grid-component',
  imports: [
    AsyncPipe,
    KategorienFilmCardComponent,
    KategorienSuchleisteComponent
  ],
  templateUrl: './kategorien-film-grid-component.html',
  styleUrl: './kategorien-film-grid-component.css',
})

/*// Lädt und filtert Filme dynamisch*/
export class KategorienFilmGridComponent implements OnChanges {
  @Input() sortierung = 'neu';
  @Input() ausgewaehlteKategorien: number[] = [];
  suchtext = '';
  filme$!: Observable<KategorienFilmInterface[]>;
  constructor(private filmeService: FilmeService) {}
  ngOnChanges(): void {
    this.filmeLaden();
  }
  suchtextAendern(neuerSuchtext: string): void {
    this.suchtext = neuerSuchtext;
    this.filmeLaden();
  }
  filmeLaden(): void {
    this.filme$ = this.filmeService.getFilmeNachKategorien(
      this.ausgewaehlteKategorien,
      this.sortierung,
      this.suchtext
    );
  }
}
