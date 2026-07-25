import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KategorienFilterComponent } from './kategorien-filter-component/kategorien-filter-component';
import { KategorienFilmGridComponent } from './kategorien-film-grid-component/kategorien-film-grid-component';
import {KategorienSuchleisteComponent} from './kategorien-suchleiste-component/kategorien-suchleiste-component';

@Component({
  selector: 'app-kategorien-component',
  imports: [
    KategorienFilterComponent,
    KategorienFilmGridComponent,
  ],
  templateUrl: './kategorien-component.html',
  styleUrl: './kategorien-component.css',
})

export class KategorienComponent implements OnInit {

  sortierung = 'neu';
  ausgewaehlteKategorien: number[] = [];

  suchtext = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.suchtext = params['suche'] ?? '';

    });

  }

}
