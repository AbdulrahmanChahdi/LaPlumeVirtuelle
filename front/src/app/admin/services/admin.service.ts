import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { Livre } from '../../models/livre.model';
import { LivreAudio } from '../../models/livre-audio.model';
import { Podcast } from '../../models/podcast.model';

export interface DashboardStats {
  usersCount: number;
  booksCount: number;
  audiobooksCount: number;
  podcastsCount: number;
  recentUsers: User[];
  recentBooks: Livre[];
  recentAudiobooks: LivreAudio[];
  recentPodcasts: Podcast[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`;
  private dashboardStats = new BehaviorSubject<DashboardStats | null>(null);

  constructor(private http: HttpClient) {}

  // Récupérer les statistiques du tableau de bord
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // Récupérer les utilisateurs récents avec pagination
  getRecentUsers(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/recent`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  // Récupérer les livres récents avec pagination
  getRecentBooks(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/recent`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  // Récupérer les livres audio récents avec pagination
  getRecentAudiobooks(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/audiobooks/recent`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  // Récupérer les podcasts récents avec pagination
  getRecentPodcasts(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/podcasts/recent`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  // Mettre à jour le statut d'un utilisateur
  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/status`, { status });
  }

  // Gestion des livres
  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${bookId}`);
  }

  // Gestion des livres audio
  deleteAudiobook(audiobookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/audiobooks/${audiobookId}`);
  }

  // Gestion des podcasts
  deletePodcast(podcastId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/podcasts/${podcastId}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getBooks(): Observable<Livre[]> {
    return this.http.get<Livre[]>(`${this.apiUrl}/books`);
  }

  getAudiobooks(): Observable<LivreAudio[]> {
    return this.http.get<LivreAudio[]>(`${this.apiUrl}/audiobooks`);
  }

  getPodcasts(): Observable<Podcast[]> {
    return this.http.get<Podcast[]>(`${this.apiUrl}/podcasts`);
  }
}
