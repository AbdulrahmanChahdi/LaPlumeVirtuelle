import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'La Plume Virtuelle';
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  hasNotifications: boolean = false;
  searchQuery: string = '';
  isAdminRoute: boolean = false;
  private authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          // Redirection initiale en fonction du rôle
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      }
    );

    // Surveiller les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Vérifier si c'est une route admin
      this.isAdminRoute = event.url.includes('/admin');
      // Fermer les menus si ouverts
      this.isMenuOpen = false;
      this.isUserMenuOpen = false;
    });
  }

  ngOnInit(): void {
    // Vérifier l'état de connexion initial
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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
    // Implémentation à venir pour la gestion des notifications
    console.log('Toggling notifications');
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Implémentation à venir pour la recherche
      console.log('Searching for:', this.searchQuery);
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
