import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categorie {
  id: number;
  nom: string;
}

export interface Auteur {
  id: number;
  nom: string;
  biographie: string;
}

export interface Livre {
  id: number;
  titre: string;
  auteur: {
    nom: string;
    prenom: string;
  };
  resume: string;
  nombreDePage: number;
  langue: string;
  imageUrl: string;
  categorie: {
    id: number;
    nom: string;
  };
  prix: number;
}

export interface LivreAudio {
  id: number;
  titre: string;
  auteur: {
    nom: string;
    prenom: string;
  };
  narrateur: string;
  duree: string;
  description: string;
  imageUrl: string;
  categorie: {
    id: number;
    nom: string;
  };
  prix: number;
}

export interface Podcast {
  id: number;
  titre: string;
  description: string;
  auteur: string;
  imageUrl: string;
  duree: string;
  categorie: {
    id: number;
    nom: string;
  };
  datePublication: string;
  nombreEpisodes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Livres numériques
  getAllLivres(params: { search?: string; categorieId?: number | null; langue?: string | null } = {}): Observable<Livre[]> {
    let queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.categorieId) {
      queryParams.append('categorieId', params.categorieId.toString());
    }
    if (params.langue) {
      queryParams.append('langue', params.langue);
    }

    return this.http.get<Livre[]>(`${this.apiUrl}/library/livres${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
  }

  // Livres audio
  getAllLivresAudio(params: { search?: string; categorieId?: number | null; dureeMax?: number | null } = {}): Observable<LivreAudio[]> {
    let queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.categorieId) {
      queryParams.append('categorieId', params.categorieId.toString());
    }
    if (params.dureeMax) {
      queryParams.append('dureeMax', params.dureeMax.toString());
    }

    return this.http.get<LivreAudio[]>(`${this.apiUrl}/library/livres-audio${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
  }

  // Podcasts
  getAllPodcasts(params: { search?: string; categorieId?: number | null; sort?: string } = {}): Observable<Podcast[]> {
    let queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.categorieId) {
      queryParams.append('categorieId', params.categorieId.toString());
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    return this.http.get<Podcast[]>(`${this.apiUrl}/library/podcasts${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
  }

  // Catégories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/library/categories`);
  }

  // Prévisualisation
  getPreview(type: 'livre' | 'livre-audio' | 'podcast', id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/library/${type}s/${id}/preview`);
  }
}
