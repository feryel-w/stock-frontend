import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrepotService } from '../../services/entrepot.service';
import { Entrepot } from '../../models/models';

@Component({
  selector: 'app-entrepots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Entrepots</h1>
        <p>Gestion des sites de stockage</p>
      </div>

      <div class="toolbar">
        <input class="search-input" [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Rechercher un entrepot..." />
        <button class="btn btn-primary" (click)="openModal()">+ Nouvel Entrepot</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Capacite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filteredEntrepots.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <div class="icon">o</div>
                  <p>Aucun entrepot trouve</p>
                </div>
              </td>
            </tr>
            <tr *ngFor="let e of filteredEntrepots">
              <td style="color:#444466; font-size:0.75rem;">#{{ e.id }}</td>
              <td><strong>{{ e.nom }}</strong></td>
              <td style="color:#8888aa;">{{ e.adresse }}</td>
              <td>
                <span class="badge badge-ok">{{ e.capacite | number }} unites</span>
              </td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-ghost btn-sm" (click)="openModal(e)">Modifier</button>
                  <button class="btn btn-danger btn-sm" (click)="delete(e.id!)">Supprimer</button>
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
          <h2>{{ editing ? 'Modifier' : 'Nouvel' }} Entrepot</h2>
          <button class="modal-close" (click)="closeModal()">x</button>
        </div>
        <div class="form-group">
          <label>Nom</label>
          <input [(ngModel)]="form.nom" placeholder="Ex: Entrepot Nord" />
        </div>
        <div class="form-group">
          <label>Adresse</label>
          <input [(ngModel)]="form.adresse" placeholder="Ex: Tunis, Rue de la Paix" />
        </div>
        <div class="form-group">
          <label>Capacite</label>
          <input type="number" [(ngModel)]="form.capacite" placeholder="Ex: 1000" />
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
export class EntrepotsComponent implements OnInit {
  entrepots: Entrepot[] = [];
  filteredEntrepots: Entrepot[] = [];
  search = '';
  showModal = false;
  editing = false;
  editId: number | null = null;
  toastMsg = '';
  toastType = 'success';
  form: Entrepot = { nom: '', adresse: '', capacite: 0 };

  constructor(private service: EntrepotService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe(d => {
      this.entrepots = d;
      this.filteredEntrepots = d;
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }

  applyFilter() {
    this.filteredEntrepots = this.entrepots.filter(e =>
      e.nom.toLowerCase().includes(this.search.toLowerCase()) ||
      e.adresse.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  openModal(e?: Entrepot) {
    if (e) {
      this.editing = true;
      this.editId = e.id!;
      this.form = { nom: e.nom, adresse: e.adresse, capacite: e.capacite };
    } else {
      this.editing = false;
      this.editId = null;
      this.form = { nom: '', adresse: '', capacite: 0 };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (this.editing && this.editId) {
      this.service.update(this.editId, this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Entrepot modifie', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Entrepot cree', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer cet entrepot ?')) {
      this.service.delete(id).subscribe({
        next: () => { this.load(); this.toast('Entrepot supprime', 'success'); },
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