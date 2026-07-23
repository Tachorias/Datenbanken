import { Routes } from '@angular/router';
import {Test} from './test/test';
import {LoginComponent} from './login-component/login-component';
import {RegisterComponent} from './register-component/register-component';
import {AgbComponent} from './legalComponent/agb-component/agb-component';
import {DatenschutzComponent} from './legalComponent/datenschutz-component/datenschutz-component';
import {ImpressumComponent} from './legalComponent/impressum-component/impressum-component';
import { MovieGridComponent } from './homePageComponent/movie-grid-component/movie-grid-component';
import { AccountComponent } from './account-component/account-component';
import { MovieView } from './movie-view/movie-view';
import { UploadComponent } from './upload-component/upload-component';
import { KategorienComponent } from './kategorien-component/kategorien-component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'test', component: Test},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'agb', component: AgbComponent},
  {path: 'datenschutz', component: DatenschutzComponent},
  {path: 'impressum', component: ImpressumComponent},
  {path: 'home', component: MovieGridComponent},
  {path: 'account', component: AccountComponent },
  {path: 'movie', component: MovieView},
  {path: 'upload', component: UploadComponent },
  {path: 'kategorien', component: KategorienComponent},
];
