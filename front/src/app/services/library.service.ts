import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Auteur {
  id: number;
  nom: string;
  prenom: string;
  biographie: string;
}

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface Editeur {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
}

export interface Livre {
  id: number;
  titre: string;
  auteur_id: number;
  editeur_id: number;
  categorie_id: number;
  date_publication: Date;
  description: string;
  prix: number;
  isbn: string;
  nombre_pages: number;
  langue: string;
  format: string;
  couverture_url: string;
  auteur?: Auteur;
  editeur?: Editeur;
  categorie?: Categorie;
}

export interface LivreAudio {
  id: number;
  titre: string;
  auteur_id: number;
  editeur_id: number;
  categorie_id: number;
  narrateur: string;
  duree: string;
  format_audio: string;
  qualite_audio: string;
  date_publication: Date;
  description: string;
  prix: number;
  isbn: string;
  langue: string;
  couverture_url: string;
  auteur?: Auteur;
  editeur?: Editeur;
  categorie?: Categorie;
}

export interface Podcast {
  id: number;
  titre: string;
  auteur_id: number;
  categorie_id: number;
  description: string;
  date_publication: Date;
  duree: string;
  langue: string;
  couverture_url: string;
  nombre_episodes: number;
  auteur?: Auteur;
  categorie?: Categorie;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Livres numériques
  getLivres(): Observable<Livre[]> {
    return this.http.get<Livre[]>(`${this.apiUrl}/livres`);
  }

  getLivreById(id: number): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/livres/${id}`);
  }

  searchLivres(query: string, categorieId?: number): Observable<Livre[]> {
    let url = `${this.apiUrl}/livres/search?q=${query}`;
    if (categorieId) {
      url += `&categorie=${categorieId}`;
    }
    return this.http.get<Livre[]>(url);
  }

  // Livres audio
  getLivresAudio(): Observable<LivreAudio[]> {
    return this.http.get<LivreAudio[]>(`${this.apiUrl}/livres-audio`);
  }

  getLivreAudioById(id: number): Observable<LivreAudio> {
    return this.http.get<LivreAudio>(`${this.apiUrl}/livres-audio/${id}`);
  }

  searchLivresAudio(query: string, categorieId?: number, duree?: string): Observable<LivreAudio[]> {
    let url = `${this.apiUrl}/livres-audio/search?q=${query}`;
    if (categorieId) {
      url += `&categorie=${categorieId}`;
    }
    if (duree) {
      url += `&duree=${duree}`;
    }
    return this.http.get<LivreAudio[]>(url);
  }

  // Podcasts
  getPodcasts(): Observable<Podcast[]> {
    return this.http.get<Podcast[]>(`${this.apiUrl}/podcasts`);
  }

  getPodcastById(id: number): Observable<Podcast> {
    return this.http.get<Podcast>(`${this.apiUrl}/podcasts/${id}`);
  }

  searchPodcasts(query: string, categorieId?: number): Observable<Podcast[]> {
    let url = `${this.apiUrl}/podcasts/search?q=${query}`;
    if (categorieId) {
      url += `&categorie=${categorieId}`;
    }
    return this.http.get<Podcast[]>(url);
  }

  // Catégories
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`);
  }

  // Auteurs
  getAuteurs(): Observable<Auteur[]> {
    return this.http.get<Auteur[]>(`${this.apiUrl}/auteurs`);
  }

  getAuteurById(id: number): Observable<Auteur> {
    return this.http.get<Auteur>(`${this.apiUrl}/auteurs/${id}`);
  }

  // Éditeurs
  getEditeurs(): Observable<Editeur[]> {
    return this.http.get<Editeur[]>(`${this.apiUrl}/editeurs`);
  }

  getEditeurById(id: number): Observable<Editeur> {
    return this.http.get<Editeur>(`${this.apiUrl}/editeurs/${id}`);
  }
}
