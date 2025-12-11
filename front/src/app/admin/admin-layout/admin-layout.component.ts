import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout">
      <nav class="admin-sidebar">
        <div class="sidebar-header">
          <img src="assets/images/logo.png" alt="Logo" class="logo">
          <h2>Administration</h2>
        </div>

        <ul class="nav-links">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active">
              <i class="fas fa-chart-line"></i>
              Tableau de bord
            </a>
          </li>
          <li>
            <a routerLink="/admin/livres" routerLinkActive="active">
              <i class="fas fa-book"></i>
              Livres
            </a>
          </li>
          <li>
            <a routerLink="/admin/livres-audio" routerLinkActive="active">
              <i class="fas fa-headphones"></i>
              Livres Audio
            </a>
          </li>
          <li>
            <a routerLink="/admin/podcasts" routerLinkActive="active">
              <i class="fas fa-podcast"></i>
              Podcasts
            </a>
          </li>
          <li>
            <a routerLink="/admin/utilisateurs" routerLinkActive="active">
              <i class="fas fa-users"></i>
              Utilisateurs
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            Déconnexion
          </button>
        </div>
      </nav>

      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>

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
    .admin-layout {
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: 100vh;
    }

    .admin-sidebar {
      background: #2c3e50;
      color: white;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1rem;
      text-align: center;
      border-bottom: 1px solid #34495e;
      margin-bottom: 1rem;

      .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 1rem;
      }

      h2 {
        margin: 0;
        font-size: 1.2rem;
        color: #ecf0f1;
      }
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 0.5rem;

        a {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: #bdc3c7;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.3s ease;

          i {
            margin-right: 1rem;
            width: 20px;
            text-align: center;
          }

          &:hover {
            background: #34495e;
            color: white;
          }

          &.active {
            background: #3498db;
            color: white;
          }
        }
      }
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 1rem;
      border-top: 1px solid #34495e;

      .logout-btn {
        width: 100%;
        padding: 0.75rem;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: background 0.3s ease;

        &:hover {
          background: #c0392b;
        }
      }
    }

    .admin-content {
      background: #f5f6fa;
      padding: 1rem;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .admin-layout {
        grid-template-columns: 1fr;
      }

      .admin-sidebar {
        position: fixed;
        left: -250px;
        top: 0;
        bottom: 0;
        width: 250px;
        z-index: 1000;
        transition: left 0.3s ease;

        &.open {
          left: 0;
        }
      }
    }

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
export class AdminLayoutComponent {
  showLogoutConfirmation = false;

  constructor(private router: Router, private authService: AuthService) {}

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
