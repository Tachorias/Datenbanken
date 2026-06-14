import { Routes } from '@angular/router';
import {Datum} from './datum/datum';
import {Test} from './test/test';
import {LoginComponent} from './login-component/login-component';
import {AgbComponent} from './legalComponent/agb-component/agb-component';
import {DatenschutzComponent} from './legalComponent/datenschutz-component/datenschutz-component';
import {ImpressumComponent} from './legalComponent/impressum-component/impressum-component';

export const routes: Routes = [
  {path: '', redirectTo: 'datum', pathMatch: 'full'},
  {path: 'datum', component: Datum},
  {path: 'test', component: Test},
  {path: 'login', component: LoginComponent},
  {path: 'agb', component: AgbComponent},
  {path: 'datenschutz', component: DatenschutzComponent},
  {path: 'impressum', component: ImpressumComponent},
];
