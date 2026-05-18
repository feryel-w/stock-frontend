import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/models';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Produits</h1>
        <p>Catalogue complet des produits</p>
      </div>

      <div class="toolbar">
        <input class="search-input" [(ngModel)]="search" placeholder="Rechercher un produit..." />
        <button class="btn btn-primary" (click)="openModal()">+ Nouveau Produit</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Fournisseur</th>
              <th>Seuil Min</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filtered().length === 0">
              <td colspan="7">
                <div class="empty-state">
                  <div class="icon">◈</div>
                  <p>Aucun produit trouvé</p>
                </div>
              </td>
            </tr>
            <tr *ngFor="let p of filtered()">
              <td style="color:#444466; font-size:0.75rem;">#{{ p.id }}</td>
              <td><strong>{{ p.nom }}</strong></td>
              <td>
                <span class="badge" style="background:rgba(108,99,255,0.1); color:#6c63ff; border:1px solid rgba(108,99,255,0.3);">
                  {{ p.categorie }}
                </span>
              </td>
              <td style="color:#43e97b; font-weight:600;">{{ p.prix | number:'1.2-2' }} DT</td>
              <td style="color:#8888aa;">{{ p.fournisseur }}</td>
              <td>{{ p.seuilMin }}</td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-ghost btn-sm" (click)="openModal(p)">✎ Modifier</button>
                  <button class="btn btn-danger btn-sm" (click)="delete(p.id!)">✕ Supprimer</button>
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
          <h2>{{ editing ? 'Modifier' : 'Nouveau' }} Produit</h2>
          <button class="modal-close" (click)="closeModal()">×</button>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Nom</label>
            <input [(ngModel)]="form.nom" placeholder="Ex: Laptop Dell" />
          </div>
          <div class="form-group">
            <label>Catégorie</label>
            <input [(ngModel)]="form.categorie" placeholder="Ex: Electronique" />
          </div>
          <div class="form-group">
            <label>Prix (DT)</label>
            <input type="number" [(ngModel)]="form.prix" placeholder="0.00" />
          </div>
          <div class="form-group">
            <label>Fournisseur</label>
            <input [(ngModel)]="form.fournisseur" placeholder="Ex: Dell" />
          </div>
          <div class="form-group">
            <label>Seuil Minimum</label>
            <input type="number" [(ngModel)]="form.seuilMin" placeholder="Ex: 5" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Créer' }}</button>
        </div>
      </div>
    </div>

    <div class="toast" [class.success]="toastType==='success'" [class.error]="toastType==='error'" *ngIf="toastMsg">
      {{ toastMsg }}
    </div>
  `
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  search = '';
  showModal = false;
  editing = false;
  editId: number | null = null;
  toastMsg = '';
  toastType = 'success';
  form: Produit = { nom: '', categorie: '', prix: 0, fournisseur: '', seuilMin: 0 };

  constructor(private service: ProduitService) {}

  ngOnInit() { this.load(); }

  load() { this.service.getAll().subscribe(d => this.produits = d); }

  filtered() {
    return this.produits.filter(p =>
      p.nom.toLowerCase().includes(this.search.toLowerCase()) ||
      p.categorie.toLowerCase().includes(this.search.toLowerCase()) ||
      p.fournisseur.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  openModal(p?: Produit) {
    if (p) {
      this.editing = true;
      this.editId = p.id!;
      this.form = { nom: p.nom, categorie: p.categorie, prix: p.prix, fournisseur: p.fournisseur, seuilMin: p.seuilMin };
    } else {
      this.editing = false;
      this.editId = null;
      this.form = { nom: '', categorie: '', prix: 0, fournisseur: '', seuilMin: 0 };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (this.editing && this.editId) {
      this.service.update(this.editId, this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Produit modifié', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Produit créé', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer ce produit ?')) {
      this.service.delete(id).subscribe({
        next: () => { this.load(); this.toast('Produit supprimé', 'success'); },
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