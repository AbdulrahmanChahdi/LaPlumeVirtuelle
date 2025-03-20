import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface Auteur {
  id: number;
  nom: string;
  biographie: string;
}

export interface Livre {
  id: number;
  titre: string;
  anneeEdition: string;
  langue: string;
  resume: string;
  disponible: boolean;
  nombreDePage: number;
  imageUrl: string;
  categorie: Categorie;
  auteur: Auteur;
}

export interface LivreAudio {
  id: number;
  titre: string;
  duree: string;
  narrateur: string;
  audioUrl: string;
  livre: Livre;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Catégories
  getAllCategories(): Observable<Categorie[]> {
    console.log('Appel de getAllCategories()');
    return this.http.get<Categorie[]>(`${this.API_URL}/api/categories`).pipe(
      tap(categories => {
        console.log('Catégories reçues:', categories);
      })
    );
  }

  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.API_URL}/api/categories/${id}`);
  }

  // Livres
  getAllLivres(): Observable<Livre[]> {
    console.log('Appel de getAllLivres()');
    return this.http.get<Livre[]>(`${this.API_URL}/api/livres`).pipe(
      tap(livres => {
        console.log('Livres reçus:', livres);
      })
    );
  }

  getLivreById(id: number): Observable<Livre> {
    return this.http.get<Livre>(`${this.API_URL}/api/livres/${id}`);
  }

  // Livres Audio
  getAllLivresAudio(params: any = {}): Observable<LivreAudio[]> {
    const url = new URL(`${this.API_URL}/api/livres-audio`);

    // Ajout des paramètres de filtrage à l'URL
    if (params.search) url.searchParams.append('search', params.search);
    if (params.categorieId) url.searchParams.append('categorieId', params.categorieId);
    if (params.dureeMax) url.searchParams.append('dureeMax', params.dureeMax);

    return this.http.get<LivreAudio[]>(url.toString()).pipe(
      tap(livresAudio => console.log('Livres audio chargés:', livresAudio))
    );
  }

  searchLivresAudio(term: string): Observable<LivreAudio[]> {
    return this.http.get<LivreAudio[]>(`${this.API_URL}/api/livres-audio/search?term=${term}`);
  }

  getLivresAudioByCategorie(categorieId: number): Observable<LivreAudio[]> {
    return this.http.get<LivreAudio[]>(`${this.API_URL}/api/livres-audio/categorie/${categorieId}`);
  }

  getLivresAudioByDuree(heures: number): Observable<LivreAudio[]> {
    return this.http.get<LivreAudio[]>(`${this.API_URL}/api/livres-audio/duree/${heures}`);
  }

  // Podcasts
  getAllPodcasts(): Observable<any[]> {
    console.log('Appel de getAllPodcasts()');
    return this.http.get<any[]>(`${this.API_URL}/api/podcasts`).pipe(
      tap(podcasts => {
        console.log('Podcasts reçus:', podcasts);
      })
    );
  }

  getPodcastById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/podcasts/${id}`);
  }
}
