import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Livre } from '../models/livre.model';
import { LivreAudio } from '../models/livre-audio.model';
import { Podcast } from '../models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Gestion des utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  // Gestion des livres
  getBooks(): Observable<Livre[]> {
    return this.http.get<Livre[]>(`${this.apiUrl}/books`);
  }

  addBook(book: FormData): Observable<Livre> {
    return this.http.post<Livre>(`${this.apiUrl}/books`, book);
  }

  updateBook(bookId: number, book: FormData): Observable<Livre> {
    return this.http.put<Livre>(`${this.apiUrl}/books/${bookId}`, book);
  }

  deleteBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/books/${bookId}`);
  }

  // Gestion des livres audio
  getAudiobooks(): Observable<LivreAudio[]> {
    return this.http.get<LivreAudio[]>(`${this.apiUrl}/audiobooks`);
  }

  addAudiobook(audiobook: FormData): Observable<LivreAudio> {
    return this.http.post<LivreAudio>(`${this.apiUrl}/audiobooks`, audiobook);
  }

  updateAudiobook(audiobookId: number, audiobook: FormData): Observable<LivreAudio> {
    return this.http.put<LivreAudio>(`${this.apiUrl}/audiobooks/${audiobookId}`, audiobook);
  }

  deleteAudiobook(audiobookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/audiobooks/${audiobookId}`);
  }

  // Gestion des podcasts
  getPodcasts(): Observable<Podcast[]> {
    return this.http.get<Podcast[]>(`${this.apiUrl}/podcasts`);
  }

  addPodcast(podcast: FormData): Observable<Podcast> {
    return this.http.post<Podcast>(`${this.apiUrl}/podcasts`, podcast);
  }

  updatePodcast(podcastId: number, podcast: FormData): Observable<Podcast> {
    return this.http.put<Podcast>(`${this.apiUrl}/podcasts/${podcastId}`, podcast);
  }

  deletePodcast(podcastId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/podcasts/${podcastId}`);
  }
}
