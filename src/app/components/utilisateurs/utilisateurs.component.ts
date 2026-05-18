import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Utilisateurs</h1>
        <p>Gestion des utilisateurs et roles</p>
      </div>

      <div class="toolbar">
        <input class="search-input" [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Rechercher un utilisateur..." />
        <button class="btn btn-primary" (click)="openModal()">+ Nouvel Utilisateur</button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="filteredUtilisateurs.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <div class="icon">u</div>
                  <p>Aucun utilisateur trouve</p>
                </div>
              </td>
            </tr>
            <tr *ngFor="let u of filteredUtilisateurs">
              <td style="color:#444466; font-size:0.75rem;">#{{ u.id }}</td>
              <td><strong>{{ u.nom }}</strong></td>
              <td style="color:#8888aa;">{{ u.email }}</td>
              <td>
                <span class="badge"
                  [style.background]="u.role === 'ADMIN' ? 'rgba(255,101,132,0.15)' : u.role === 'GESTIONNAIRE' ? 'rgba(108,99,255,0.1)' : 'rgba(67,233,123,0.1)'"
                  [style.color]="u.role === 'ADMIN' ? '#ff6584' : u.role === 'GESTIONNAIRE' ? '#6c63ff' : '#43e97b'"
                  [style.border]="u.role === 'ADMIN' ? '1px solid rgba(255,101,132,0.3)' : u.role === 'GESTIONNAIRE' ? '1px solid rgba(108,99,255,0.3)' : '1px solid rgba(67,233,123,0.25)'">
                  {{ u.role }}
                </span>
              </td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-ghost btn-sm" (click)="openModal(u)">Modifier</button>
                  <button class="btn btn-danger btn-sm" (click)="delete(u.id)">Supprimer</button>
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
          <h2>{{ editing ? 'Modifier' : 'Nouvel' }} Utilisateur</h2>
          <button class="modal-close" (click)="closeModal()">x</button>
        </div>
        <div class="form-group">
          <label>Nom</label>
          <input [(ngModel)]="form.nom" placeholder="Ex: Feryel" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input [(ngModel)]="form.email" placeholder="Ex: feryel@mail.com" />
        </div>
        <div *ngIf="!editing" class="form-group">
          <label>Mot de Passe</label>
          <input type="password" [(ngModel)]="form.motDePasse" placeholder="Min 8 car, maj, min, chiffre, special" />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select [(ngModel)]="form.role">
            <option value="">-- Choisir un role --</option>
            <option value="ADMIN">ADMIN</option>
            <option value="GESTIONNAIRE">GESTIONNAIRE</option>
            <option value="CONSULTANT">CONSULTANT</option>
          </select>
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
export class UtilisateursComponent implements OnInit {
  utilisateurs: any[] = [];
  filteredUtilisateurs: any[] = [];
  search = '';
  showModal = false;
  editing = false;
  editId: number | null = null;
  toastMsg = '';
  toastType = 'success';
  form: any = { nom: '', email: '', motDePasse: '', role: '' };

  private url = 'http://localhost:8080/utilisateurs';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<any[]>(this.url).subscribe(d => {
      this.utilisateurs = d;
      this.filteredUtilisateurs = d;
      setTimeout(() => this.cdr.detectChanges(), 0);
    });
  }

  applyFilter() {
    this.filteredUtilisateurs = this.utilisateurs.filter(u =>
      u.nom.toLowerCase().includes(this.search.toLowerCase()) ||
      u.email.toLowerCase().includes(this.search.toLowerCase()) ||
      u.role.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  openModal(u?: any) {
    if (u) {
      this.editing = true;
      this.editId = u.id;
      this.form = { nom: u.nom, email: u.email, motDePasse: '', role: u.role };
    } else {
      this.editing = false;
      this.editId = null;
      this.form = { nom: '', email: '', motDePasse: '', role: '' };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (this.editing && this.editId) {
      this.http.put(`${this.url}/${this.editId}`, this.form, { responseType: 'text' }).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Utilisateur modifie', 'success'); },
        error: () => this.toast('Erreur', 'error')
      });
    } else {
      this.http.post(`${this.url}/inscrire`, this.form).subscribe({
        next: () => { this.load(); this.closeModal(); this.toast('Utilisateur cree', 'success'); },
        error: (err) => {
          if (err.status === 400) {
            this.toast(err.error?.message || 'Donnees invalides', 'error');
          } else {
            this.toast('Erreur serveur', 'error');
          }
        }
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.http.delete(`${this.url}/${id}`).subscribe({
        next: () => { this.load(); this.toast('Utilisateur supprime', 'success'); },
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