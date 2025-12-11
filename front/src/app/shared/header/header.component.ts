import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <a routerLink="/">
            <img src="assets/images/logo.png" alt="La Plume Virtuelle">
          </a>
        </div>

        <nav class="main-nav">
          <a routerLink="/bibliotheque" routerLinkActive="active">Bibliothèque</a>
          <a routerLink="/livres-audio" routerLinkActive="active">Livres Audio</a>
          <a routerLink="/podcasts" routerLinkActive="active">Podcasts</a>
        </nav>

        <div class="user-menu">
          <div class="user-info" *ngIf="isLoggedIn">
            <span class="user-name">{{ userName }}</span>
            <button class="logout-btn" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              Déconnexion
            </button>
          </div>
          <div class="auth-buttons" *ngIf="!isLoggedIn">
            <a routerLink="/auth/login" class="login-btn">Connexion</a>
            <a routerLink="/auth/register" class="register-btn">Inscription</a>
          </div>
        </div>
      </div>
    </header>

    <div class="logout-modal" *ngIf="showLogoutConfirmation">
      <div class="modal-content">
        <h2>Confirmation de déconnexion</h2>
        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
        <div class="modal-actions">
          <button class="btn-confirm" (click)="confirmLogout()">
            Oui, me déconnecter
          </button>
          <button class="btn-cancel" (click)="cancelLogout()">
            Annuler
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    // ... existing styles ...

    .logout-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
    }

    .modal-content h2 {
      margin-bottom: 1rem;
      color: #111827;
      font-size: 1.5rem;
    }

    .modal-content p {
      margin-bottom: 1.5rem;
      color: #4B5563;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-confirm {
      background-color: #111827;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-confirm:hover {
      background-color: #1F2937;
    }

    .btn-cancel {
      background-color: #EF4444;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-cancel:hover {
      background-color: #DC2626;
    }
  `]
})
export class HeaderComponent {
  isLoggedIn = false;
  userName = '';
  showLogoutConfirmation = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userName = this.authService.getUserName();
      }
    });
  }

  logout() {
    this.showLogoutConfirmation = true;
  }

  confirmLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.showLogoutConfirmation = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors de la déconnexion:', error);
        this.showLogoutConfirmation = false;
      }
    });
  }

  cancelLogout() {
    this.showLogoutConfirmation = false;
  }
}
