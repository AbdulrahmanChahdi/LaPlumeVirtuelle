import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Livre {
  id: number;
  titre: string;
  description: string;
  couverture_url: string;
  date_publication: string;
  nombre_pages: number;
  format: string;
  prix: number;
  auteur_id: number;
  editeur_id: number;
  categorie_id: number;
  auteur: {
    id: number;
    nom: string;
    prenom: string;
  };
  editeur: {
    id: number;
    nom: string;
  };
  categorie: {
    id: number;
    nom: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  private apiUrl = `${environment.apiUrl}/api/livres`;

  constructor(private http: HttpClient) {}

  getAllLivres(): Observable<Livre[]> {
    return this.http.get<Livre[]>(this.apiUrl);
  }

  getLivre(id: number): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/${id}`);
  }

  addLivre(livre: Omit<Livre, 'id'>): Observable<Livre> {
    return this.http.post<Livre>(`${this.apiUrl}/add`, livre);
  }

  deleteLivre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
