import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private readonly ADMIN_NAME_KEY = 'admin_name';
  private readonly ADMIN_AVATAR_KEY = 'admin_avatar';

  constructor(private router: Router) {}

  logout(): void {
    // Supprimer toutes les données d'authentification
    localStorage.clear();
    sessionStorage.clear();

    // Redirection vers la racine, laissant le routeur gérer la redirection par défaut
    window.location.href = '/';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getAdminName(): string {
    return localStorage.getItem(this.ADMIN_NAME_KEY) || 'Admin';
  }

  getAdminAvatar(): string {
    return localStorage.getItem(this.ADMIN_AVATAR_KEY) || 'assets/images/default-avatar.png';
  }
}
