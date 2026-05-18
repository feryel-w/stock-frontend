import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <span class="login-logo">▲</span>
          <h1>STOCKFLOW</h1>
          <p>Connectez-vous a votre compte</p>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="Ex: feryel@mail.com" />
        </div>
        <div class="form-group">
          <label>Mot de Passe</label>
          <input type="password" [(ngModel)]="motDePasse" placeholder="Votre mot de passe" (keyup.enter)="login()" />
        </div>

        <button class="btn btn-primary" style="width:100%; justify-content:center; padding:14px;" (click)="login()">
          Se Connecter
        </button>

        <div class="toast error" *ngIf="errorMsg" style="position:relative; bottom:auto; right:auto; margin-top:16px;">
          {{ errorMsg }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      background-image: radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, rgba(255,101,132,0.06) 0%, transparent 60%);
    }
    .login-card {
      background: #13131e;
      border: 1px solid #2a2a3a;
      border-radius: 16px;
      padding: 48px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    }
    .login-header {
      text-align: center;
      margin-bottom: 36px;
    }
    .login-logo {
      font-size: 2rem;
      color: #6c63ff;
      display: block;
      margin-bottom: 12px;
    }
    .login-header h1 {
      font-family: 'Syne', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 3px;
      color: #f0f0ff;
      margin-bottom: 8px;
    }
    .login-header p {
      color: #8888aa;
      font-size: 0.85rem;
    }
  `]
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  login() {
    if (!this.email || !this.motDePasse) {
      this.errorMsg = 'Veuillez remplir tous les champs';
      return;
    }
    this.http.post<any>(
      `http://localhost:8080/utilisateurs/connecter?email=${this.email}&motDePasse=${this.motDePasse}`,
      {}
    ).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMsg = 'Email ou mot de passe incorrect';
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    });
  }
}