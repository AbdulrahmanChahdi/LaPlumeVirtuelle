import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private readonly API_URL = 'http://localhost:8080/api/v9/Utilisateur';

  private utilisateur?: any; // Cache local

  constructor(private http: HttpClient) {}

  // 🔁 Récupérer l'utilisateur connecté depuis le backend (via /me)
  getConnectedUtilisateur(): Observable<any> {
    return this.http.get(`${this.API_URL}/me`);
  }

  // ✅ Getter pour accéder au cache local dans d'autres composants
  getLocalUtilisateur(): any {
    return this.utilisateur;
  }

  // ✅ Setter pour stocker localement
  setLocalUtilisateur(user: any): void {
    this.utilisateur = user;
  }

  // ✏️ Mettre à jour les infos du user
  updateUtilisateur(data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/update`, data);
  }

  // ❌ Supprimer un utilisateur (ex: désinscription)
  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  // 👥 Pour l’admin : récupérer tous les utilisateurs
  getAllUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all`);
  }

  // 👤 Récupérer un utilisateur spécifique (ex: profil)
  getUtilisateurById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }
}
