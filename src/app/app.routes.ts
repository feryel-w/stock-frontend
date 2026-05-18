import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntrepotsComponent } from './components/entrepots/entrepots.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { MouvementsComponent } from './components/mouvements/mouvements.component';
import { UtilisateursComponent } from './components/utilisateurs/utilisateurs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, runGuardsAndResolvers: 'always' },
  { path: 'entrepots', component: EntrepotsComponent, runGuardsAndResolvers: 'always' },
  { path: 'produits', component: ProduitsComponent, runGuardsAndResolvers: 'always' },
  { path: 'stocks', component: StocksComponent, runGuardsAndResolvers: 'always' },
  { path: 'mouvements', component: MouvementsComponent, runGuardsAndResolvers: 'always' },
  { path: 'utilisateurs', component: UtilisateursComponent, title: 'Utilisateurs' },
];