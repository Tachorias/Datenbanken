import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';

interface Kategorie {
  idKategorie: number;
  Name: string;
}

/*// Upload-Komponente mit Formularen*/
@Component({
  selector: 'app-upload-component',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './upload-component.html',
  styleUrl: './upload-component.css',
})

/*// Speichern Uploaddaten und Auswahlzustand*/
export class UploadComponent {
  titel = '';
  beschreibung = '';
  coverDatei: File | null = null;
  filmDatei: File | null = null;
  fehler: string[] = [];
  kategorien$: Observable<Kategorie[]>;
  ausgewaehlteKategorien: number[] = [];



  /*// Kategorien an oder aus*/
  kategorieUmschalten(idKategorie: number): void {
    if (this.ausgewaehlteKategorien.includes(idKategorie)) {
      this.ausgewaehlteKategorien = this.ausgewaehlteKategorien.filter(id => id !== idKategorie);
    } else {
      this.ausgewaehlteKategorien.push(idKategorie);
    }
  }

  /*// Prüft, ob Kategorie ausgewählt ist*/
  istAusgewaehlt(idKategorie: number): boolean {
    return this.ausgewaehlteKategorien.includes(idKategorie);
  }

  /*// Lädt Kategorien vom Server*/
  constructor(private http: HttpClient, private router: Router) {
    this.kategorien$ = this.http.get<Kategorie[]>('/api/kategorien');
  }

  /*// Wählt Coverdatei aus*/
  coverAuswaehlen(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.coverDatei = input.files?.[0] ?? null;
  }

  /*// Wählt eine Filmdatei aus*/
  filmAuswaehlen(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filmDatei = input.files?.[0] ?? null;
  }

  /*// lädt Film hoch*/
  hochladen(): void {
    this.fehler = [];

    if (!this.titel.trim()) {
      this.fehler.push('Titel fehlt!');
    }

    if (!this.beschreibung.trim()) {
      this.fehler.push('Beschreibung fehlt!');
    }

    if (!this.coverDatei) {
      this.fehler.push('Cover fehlt!');
    } else if (this.coverDatei.type !== 'image/jpeg') {
      this.fehler.push('Cover muss JPEG sein!');
    }

    if (!this.filmDatei) {
      this.fehler.push('Film fehlt!');
    } else if (this.filmDatei.type !== 'video/mp4') {
      this.fehler.push('Film muss MP4 sein!');
    }

    if (this.fehler.length > 0) {
      return;
    }

    const daten = new FormData();

    daten.append('titel', this.titel);
    daten.append('beschreibung', this.beschreibung);
    daten.append('cover', this.coverDatei!);
    daten.append('film', this.filmDatei!);
    daten.append('kategorien', JSON.stringify(this.ausgewaehlteKategorien));

    this.http.post('/api/movies', daten).subscribe(() => {
      alert('Film wurde mit Dateien hochgeladen.');

      this.titel = '';
      this.beschreibung = '';
      this.coverDatei = null;
      this.filmDatei = null;
      this.fehler = [];
      this.router.navigate(['/account']);
    });

    if (this.ausgewaehlteKategorien.length === 0) {
      this.fehler.push('Kategorie fehlt.');
    }
  }

}
