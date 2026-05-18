import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntrepotsComponent } from './components/entrepots/entrepots.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { MouvementsComponent } from './components/mouvements/mouvements.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'entrepots', component: EntrepotsComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'stocks', component: StocksComponent },
  { path: 'mouvements', component: MouvementsComponent },
];