import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EntrepotService } from '../../services/entrepot.service';
import { ProduitService } from '../../services/produit.service';
import { StockService, MouvementService } from '../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Tableau de Bord</h1>
        <p>Vue d'ensemble du système de gestion des stocks</p>
      </div>

      <div class="grid-4" style="margin-bottom: 32px;">
        <div class="stat-card purple">
          <div class="stat-icon">◫</div>
          <div class="stat-number">{{ entrepots }}</div>
          <div class="stat-label">Entrepôts</div>
        </div>
        <div class="stat-card pink">
          <div class="stat-icon">◈</div>
          <div class="stat-number">{{ produits }}</div>
          <div class="stat-label">Produits</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">◉</div>
          <div class="stat-number">{{ stocks }}</div>
          <div class="stat-label">Stocks</div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">⇄</div>
          <div class="stat-number">{{ mouvements }}</div>
          <div class="stat-label">Mouvements</div>
        </div>
      </div>

      <div *ngIf="alertes.length > 0" class="alert-banner">
        <span style="font-size:1.2rem">⚠</span>
        <strong>{{ alertes.length }} stock(s) en alerte</strong> — Quantité inférieure au seuil d'alerte
        <a routerLink="/stocks" style="margin-left:auto; color:inherit; text-decoration:underline; font-size:0.8rem;">
          Voir les stocks →
        </a>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 style="font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; margin-bottom:20px; color:#8888aa; text-transform:uppercase; letter-spacing:1.5px;">
            ⚠ Stocks en Alerte
          </h3>
          <div *ngIf="alertes.length === 0" class="empty-state">
            <div class="icon">✓</div>
            <p>Tous les stocks sont à niveau</p>
          </div>
          <div *ngFor="let s of alertes" style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #2a2a3a;">
            <div>
              <div style="font-size:0.85rem; font-weight:500;">{{ s.nomProduit }}</div>
              <div style="font-size:0.75rem; color:#8888aa;">{{ s.nomEntrepot }}</div>
            </div>
            <span class="badge badge-alert">{{ s.quantite }} / {{ s.seuilAlerte }}</span>
          </div>
        </div>

        <div class="card">
          <h3 style="font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; margin-bottom:20px; color:#8888aa; text-transform:uppercase; letter-spacing:1.5px;">
            ⇄ Derniers Mouvements
          </h3>
          <div *ngIf="derniersMouvements.length === 0" class="empty-state">
            <div class="icon">⇄</div>
            <p>Aucun mouvement enregistré</p>
          </div>
          <div *ngFor="let m of derniersMouvements" style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #2a2a3a;">
            <div>
              <div style="font-size:0.85rem; font-weight:500;">{{ m.nomProduit }}</div>
              <div style="font-size:0.75rem; color:#8888aa;">{{ m.date }} — {{ m.nomEntrepot }}</div>
            </div>
            <span class="badge" [class.badge-entree]="m.type==='entree'" [class.badge-sortie]="m.type==='sortie'">
              {{ m.type === 'entree' ? '+' : '-' }}{{ m.quantite }}
            </span>
          </div>
        </div>
      </div>

      <div style="margin-top:32px;">
        <h3 style="font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; margin-bottom:20px; color:#8888aa; text-transform:uppercase; letter-spacing:1.5px;">
          ◈ Accès Rapide
        </h3>
        <div class="grid-4">
          <a routerLink="/entrepots" class="quick-link">
            <span style="font-size:1.8rem; margin-bottom:10px; display:block;">◫</span>
            <strong>Gérer Entrepôts</strong>
            <p>Ajouter, modifier, supprimer</p>
          </a>
          <a routerLink="/produits" class="quick-link">
            <span style="font-size:1.8rem; margin-bottom:10px; display:block;">◈</span>
            <strong>Gérer Produits</strong>
            <p>Catalogue complet</p>
          </a>
          <a routerLink="/stocks" class="quick-link">
            <span style="font-size:1.8rem; margin-bottom:10px; display:block;">◉</span>
            <strong>Gérer Stocks</strong>
            <p>Par entrepôt et produit</p>
          </a>
          <a routerLink="/mouvements" class="quick-link">
            <span style="font-size:1.8rem; margin-bottom:10px; display:block;">⇄</span>
            <strong>Enregistrer Mouvement</strong>
            <p>Entrée / Sortie</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-link {
      display: block;
      padding: 24px;
      background: #13131e;
      border: 1px solid #2a2a3a;
      border-radius: 12px;
      text-decoration: none;
      color: #f0f0ff;
      transition: all 0.2s;
      cursor: pointer;
    }
    .quick-link:hover {
      border-color: #6c63ff;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(108,99,255,0.2);
    }
    .quick-link strong {
      font-family: 'Syne', sans-serif;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 6px;
    }
    .quick-link p { font-size: 0.75rem; color: #8888aa; }
  `]
})
export class DashboardComponent implements OnInit {
  entrepots = 0;
  produits = 0;
  stocks = 0;
  mouvements = 0;
  alertes: any[] = [];
  derniersMouvements: any[] = [];

  constructor(
    private entrepotService: EntrepotService,
    private produitService: ProduitService,
    private stockService: StockService,
    private mouvementService: MouvementService
  ) {}

  ngOnInit() {
    this.entrepotService.getAll().subscribe(d => this.entrepots = d.length);
    this.produitService.getAll().subscribe(d => this.produits = d.length);
    this.stockService.getAll().subscribe(d => this.stocks = d.length);
    this.stockService.getAlertes().subscribe(d => this.alertes = d);
    this.mouvementService.getAll().subscribe(d => {
      this.mouvements = d.length;
      this.derniersMouvements = d.slice(-5).reverse();
    });
  }
}