import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { KeycloakService } from './auth/keycloak.service';
import { UtilisateurService } from './services/utilisateur.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'La Plume Virtuelle';
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  hasNotifications: boolean = false;
  searchQuery: string = '';
  isAdminRoute: boolean = false;
  isAuthRoute: boolean = false;

  utilisateur?: any;

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService
  ) {
    // Fermer les menus lors de changement de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.includes('/admin');
      this.isAuthRoute = event.url.includes('/auth');
      this.isMenuOpen = false;
      this.isUserMenuOpen = false;
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!KeycloakService.getToken();

    if (this.isLoggedIn) {
      this.utilisateurService.getConnectedUtilisateur().subscribe({
        next: (data) => {
          this.utilisateur = data;
          this.utilisateurService.setLocalUtilisateur(data);
          console.log('✅ Utilisateur connecté :', data);

          // Redirection selon rôle
          const roles = KeycloakService.getRoles();
          const currentUrl = this.router.url;

          if (roles.includes('admin') && !currentUrl.includes('/admin')) {
            this.router.navigate(['/admin/dashboard']);
          } 
          else if (!roles.includes('admin') && !currentUrl.includes('/dashboard')) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('❌ Erreur utilisateur connecté :', err);
        }
      });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  toggleNotifications(): void {
    console.log('Toggling notifications');
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }

  seConnecter(): void {
    KeycloakService.login();
  }

  sInscrire(): void {
    KeycloakService.register({});
  }

  logout(): void {
    KeycloakService.logout();
  }
}
