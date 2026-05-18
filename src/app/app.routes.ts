import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntrepotsComponent } from './components/entrepots/entrepots.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { MouvementsComponent } from './components/mouvements/mouvements.component';
import { UtilisateursComponent } from './components/utilisateurs/utilisateurs.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], runGuardsAndResolvers: 'always' },
  { path: 'entrepots', component: EntrepotsComponent, canActivate: [authGuard], runGuardsAndResolvers: 'always' },
  { path: 'produits', component: ProduitsComponent, canActivate: [authGuard], runGuardsAndResolvers: 'always' },
  { path: 'stocks', component: StocksComponent, canActivate: [authGuard], runGuardsAndResolvers: 'always' },
  { path: 'mouvements', component: MouvementsComponent, canActivate: [authGuard], runGuardsAndResolvers: 'always' },
  { path: 'utilisateurs', component: UtilisateursComponent, canActivate: [adminGuard], title: 'Utilisateurs' },
];