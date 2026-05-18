import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MouvementService } from '../../services/stock.service';
import { EntrepotService } from '../../services/entrepot.service';
import { ProduitService } from '../../services/produit.service';
import { MouvementStock, Entrepot, Produit } from '../../models/models';

@Component({
  selector: 'app-mouvements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Mouvements</h1>
        <p>Historique des entrées et sorties de stock</p>
      </div>

      <div class="toolbar">
        <input class="search-input" [(ngModel)]="search" placeholder="Rechercher..." />
        <button class="btn btn-primary" (click)="openModal()">+ Enregistrer Mouvement</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Produit</th>
              <th>Entrepôt</th>
              <th>Quantité</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filtered().length === 0">
              <td colspan="6">
                <div class="empty-state">
                  <div class="icon">⇄</div>
                  <p>Aucun mouvement enregistré</p>
                </div>
              </td>
            </tr>
            <tr *ngFor="let m of filtered()">
              <td style="color:#444466; font-size:0.75rem;">#{{ m.id }}</td>
              <td>
                <span class="badge"
                  [class.badge-entree]="m.type==='entree'"
                  [class.badge-sortie]="m.type==='sortie'">
                  {{ m.type === 'entree' ? '↑ ENTRÉE' : '↓ SORTIE' }}
                </span>
              </td>
              <td><strong>{{ m.nomProduit }}</strong></td>
              <td style="color:#8888aa;">{{ m.nomEntrepot }}</td>
              <td>
                <span [style.color]="m.type==='entree' ? '#43e97b' : '#ff6584'"
                      style="font-weight:700; font-family:'Syne',sans-serif; font-size:1rem;">
                  {{ m.type === 'entree' ? '+' : '-' }}{{ m.quantite }}
                </span>
              </td>
              <td style="color:#8888aa; font-size:0.78rem;">{{ m.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Enregistrer un Mouvement</h2>
          <button class="modal-close" (click)="closeModal()">×</button>
        </div>

        <div class="form-group">
          <label>Type de Mouvement</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button class="btn" style="justify-content:center; padding:16px;"
              [style.background]="form.type==='entree' ? 'rgba(67,233,123,0.15)' : 'transparent'"
              [style.borderColor]="form.type==='entree' ? '#43e97b' : '#2a2a3a'"
              [style.color]="form.type==='entree' ? '#43e97b' : '#8888aa'"
              (click)="form.type='entree'">
              ↑ ENTRÉE
            </button>
            <button class="btn" style="justify-content:center; padding:16px;"
              [style.background]="form.type==='sortie' ? 'rgba(255,101,132,0.15)' : 'transparent'"
              [style.borderColor]="form.type==='sortie' ? '#ff6584' : '#2a2a3a'"
              [style.color]="form.type==='sortie' ? '#ff6584' : '#8888aa'"
              (click)="form.type='sortie'">
              ↓ SORTIE
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Produit</label>
          <select [(ngModel)]="form.produitId">
            <option value="">-- Choisir un produit --</option>
            <option *ngFor="let p of produits" [value]="p.id">{{ p.nom }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Entrepôt</label>
          <select [(ngModel)]="form.entrepotId">
            <option value="">-- Choisir un entrepôt --</option>
            <option *ngFor="let e of entrepots" [value]="e.id">{{ e.nom }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Quantité</label>
          <input type="number" [(ngModel)]="form.quantite" placeholder="Ex: 50" />
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()">Enregistrer</button>
        </div>
      </div>
    </div>

    <div class="toast" [class.success]="toastType==='success'" [class.error]="toastType==='error'" *ngIf="toastMsg">
      {{ toastMsg }}
    </div>
  `
})
export class MouvementsComponent implements OnInit {
  mouvements: MouvementStock[] = [];
  entrepots: Entrepot[] = [];
  produits: Produit[] = [];
  search = '';
  showModal = false;
  toastMsg = '';
  toastType = 'success';
  form: any = { type: 'entree', produitId: '', entrepotId: '', quantite: 0 };

  constructor(
    private mouvementService: MouvementService,
    private entrepotService: EntrepotService,
    private produitService: ProduitService
  ) {}

  ngOnInit() {
    this.load();
    this.entrepotService.getAll().subscribe(d => this.entrepots = d);
    this.produitService.getAll().subscribe(d => this.produits = d);
  }

  load() { this.mouvementService.getAll().subscribe(d => this.mouvements = d.reverse()); }

  filtered() {
    return this.mouvements.filter(m =>
      (m.nomProduit || '').toLowerCase().includes(this.search.toLowerCase()) ||
      (m.nomEntrepot || '').toLowerCase().includes(this.search.toLowerCase())
    );
  }

  openModal() {
    this.form = { type: 'entree', produitId: '', entrepotId: '', quantite: 0 };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    this.mouvementService.create(+this.form.produitId, +this.form.entrepotId, this.form.type, +this.form.quantite).subscribe({
      next: () => { this.load(); this.closeModal(); this.toast('Mouvement enregistré', 'success'); },
      error: (err) => this.toast(err.error?.message || 'Erreur — vérifiez le stock disponible', 'error')
    });
  }

  toast(msg: string, type: string) {
    this.toastMsg = msg;
    this.toastType = type;
    setTimeout(() => this.toastMsg = '', 4000);
  }
}