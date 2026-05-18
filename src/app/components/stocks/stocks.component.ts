import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { EntrepotService } from '../../services/entrepot.service';
import { ProduitService } from '../../services/produit.service';
import { Stock, Entrepot, Produit } from '../../models/models';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Stocks</h1>
        <p>Etat des stocks par entrepot et produit</p>
      </div>

      <div *ngIf="alertes.length > 0" class="alert-banner">
        <span style="font-size:1.2rem">!</span>
        <strong>{{ alertes.length }} stock(s) en alerte !</strong> Quantite inferieure ou egale au seuil.
      </div>

      <div class="toolbar">
        <input class="search-input" [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Rechercher par produit ou entrepot..." />
        <div style="display:flex; gap:8px;">
          <button class="btn" [class.btn-primary]="showAlertes" [class.btn-ghost]="!showAlertes" (click)="toggleAlertes()">
            Alertes ({{ alertes.length }})
          </button>
          <button class="btn btn-primary" (click)="openModal()">+ Nouveau Stock</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Produit</th>
              <th>Entrepot</th>
              <th>Quantite</th>
              <th>Seuil Alerte</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filteredStocks.length === 0">
              <td colspan="7">
                <div class="empty-state">
                  <div class="icon">o</div>
                  <p>Aucun stock trouve</p>
                </div>
              </td>
            </tr>
            <tr *ngFor="let s of filteredStocks">
              <td style="color:#444466; font-size:0.75rem;">#{{ s.id }}</td>
              <td><strong>{{ s.nomProduit }}</strong></td>
              <td style="color:#8888aa;">{{ s.nomEntrepot }}</td>
              <td>
                <span style="font-size:1.1rem; font-weight:700; font-family:'Syne',sans-serif;"
                  [style.color]="s.quantite <= s.seuilAlerte ? '#ff6584' : '#43e97b'">
                  {{ s.quantite }}
                </span>
              </td>
              <td style="color:#8888aa;">{{ s.seuilAlerte }}</td>
              <td>
                <span class="badge"
                  [class.badge-alert]="s.quantite <= s.seuilAlerte"
                  [class.badge-ok]="s.quantite > s.seuilAlerte">
                  {{ s.quantite <= s.seuilAlerte ? 'ALERTE' : 'OK' }}
                </span>
              </td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-ghost btn-sm" (click)="openModal(s)">Modifier</button>
                  <button class="btn btn-danger btn-sm" (click)="delete(s.id!)">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ editing ? 'Modifier Stock' : 'Nouveau Stock' }}</h2>
          <button class="modal-close" (click)="closeModal()">x</button>
        </div>
        <div *ngIf="!editing">
          <div class="form-group">
            <label>Produit</label>
            <select [(ngModel)]="selectedProduitId">
              <option value="">-- Choisir un produit --</option>
              <option *ngFor="let p of produits" [value]="p.id">{{ p.nom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Entrepot</label>
            <select [(ngModel)]="selectedEntrepotId">
              <option value="">-- Choisir un entrepot --</option>
              <option *ngFor="let e of entrepots" [value]="e.id">{{ e.nom }}</option>
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Quantite</label>
            <input type="number" [(ngModel)]="form.quantite" placeholder="0" />
          </div>
          <div class="form-group">
            <label>Seuil Alerte</label>
            <input type="number" [(ngModel)]="form.seuilAlerte" placeholder="0" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Creer' }}</button>
        </div>
      </div>
    </div>

    <div class="toast" [class.success]="toastType==='success'" [class.error]="toastType==='error'" *ngIf="toastMsg">
      {{ toastMsg }}
    </div>
  `
})
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  alertes: Stock[] = [];
  entrepots: Entrepot[] = [];
  produits: Produit[] = [];
  search = '';
  showModal = false;
  showAlertes = false;
  editing = false;
  editId: number | null = null;
  selectedProduitId: any = '';
  selectedEntrepotId: any = '';
  toastMsg = '';
  toastType = 'success';
  form: Stock = { quantite: 0, seuilAlerte: 0 };

  constructor(
    private stockService: StockService,
    private entrepotService: EntrepotService,
    private produitService: ProduitService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
    this.entrepotService.getAll().subscribe(d => { this.entrepots = d; setTimeout(() => this.cdr.detectChanges(), 0); });
    this.produitService.getAll().subscribe(d => { this.produits = d; setTimeout(() => this.cdr.detectChanges(), 0); });
    this.stockService.getAlertes().subscribe(d => { this.alertes = d; setTimeout(() => this.cdr.detectChanges(), 0); });
  }

  load() {
    this.stockService.getAll().subscribe(d => {
      this.stocks = d;
      this.filteredStocks = d;
      setTimeout(() => this.cdr.detectChanges(), 0);
    });
  }

  applyFilter() {
    let list = this.showAlertes ? this.alertes : this.stocks;
    this.filteredStocks = list.filter(s =>
      (s.nomProduit || '').toLowerCase().includes(this.search.toLowerCase()) ||
      (s.nomEntrepot || '').toLowerCase().includes(this.search.toLowerCase())
    );
  }

  toggleAlertes() {
    this.showAlertes = !this.showAlertes;
    if (this.showAlertes) {
      this.stockService.getAlertes().subscribe(d => {
        this.alertes = d;
        this.filteredStocks = d;
        setTimeout(() => this.cdr.detectChanges(), 0);
      });
    } else {
      this.filteredStocks = this.stocks;
      setTimeout(() => this.cdr.detectChanges(), 0);
    }
  }

  openModal(s?: Stock) {
    if (s) {
      this.editing = true;
      this.editId = s.id!;
      this.form = { quantite: s.quantite, seuilAlerte: s.seuilAlerte };
    } else {
      this.editing = false;
      this.editId = null;
      this.form = { quantite: 0, seuilAlerte: 0 };
      this.selectedProduitId = '';
      this.selectedEntrepotId = '';
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (this.editing && this.editId) {
      this.stockService.update(this.editId, this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Stock modifie', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    } else {
      this.stockService.create(+this.selectedProduitId, +this.selectedEntrepotId, this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Stock cree', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer ce stock ?')) {
      this.stockService.delete(id).subscribe({
        next: () => { this.load(); this.toast('Stock supprime', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    }
  }

  toast(msg: string, type: string) {
    this.toastMsg = msg;
    this.toastType = type;
    setTimeout(() => this.toastMsg = '', 3000);
  }
}