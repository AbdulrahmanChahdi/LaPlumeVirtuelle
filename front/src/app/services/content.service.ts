import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface Livre {
  id: number;
  titre: string;
  anneeEdition: string;
  langue: string;
  resume: string;
  disponible: boolean;
  nombreDePage: number;
  categorie: Categorie;
  auteur: Auteur;
}

export interface Categorie {
  id: number;
  nom: string;
}

export interface Auteur {
  id: number;
  nom: string;
  prenom: string;
  biographie: string;
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
  getAllLivresAudio(): Observable<any[]> {
    console.log('Appel de getAllLivresAudio()');
    return this.http.get<any[]>(`${this.API_URL}/api/livres-audio`).pipe(
      tap(livresAudio => {
        console.log('Livres audio reçus:', livresAudio);
      })
    );
  }

  getLivreAudioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/livres-audio/${id}`);
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
