import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="nav-logo">▲</span>
        <span class="nav-title">STOCKFLOW</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <span>⬡</span> Dashboard
        </a>
        <a routerLink="/entrepots" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <span>◫</span> Entrepôts
        </a>
        <a routerLink="/produits" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <span>◈</span> Produits
        </a>
        <a routerLink="/stocks" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <span>◉</span> Stocks
        </a>
        <a routerLink="/mouvements" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <span>⇄</span> Mouvements
        </a>
      </div>
      <div class="nav-status">
        <span class="status-dot"></span>
        <span>API Connected</span>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      padding: 0 32px;
      height: 64px;
      background: rgba(10,10,15,0.95);
      border-bottom: 1px solid #2a2a3a;
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
      gap: 40px;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .nav-logo { font-size: 1.2rem; color: #6c63ff; }
    .nav-title {
      font-family: 'Syne', sans-serif;
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 3px;
      color: #f0f0ff;
    }
    .nav-links { display: flex; gap: 4px; flex: 1; }
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      text-decoration: none;
      color: #8888aa;
      font-size: 0.8rem;
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: all 0.2s;
    }
    .nav-links a:hover { color: #f0f0ff; background: #1a1a24; }
    .nav-links a.active { color: #6c63ff; background: rgba(108,99,255,0.1); }
    .nav-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: #43e97b;
      flex-shrink: 0;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #43e97b;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(67,233,123,0.4); }
      50% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(67,233,123,0); }
    }
  `]
})
export class NavbarComponent {}