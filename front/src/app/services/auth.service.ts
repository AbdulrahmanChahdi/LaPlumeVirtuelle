import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nom: string;
  adresseMail: string;
  adressePostal: string;
  tel: string;
  dateInscription: string;
  role: string;
}

export interface LoginData {
  adresseMail: string;
  motDePasse: string;
}

export interface RegisterData {
  nom: string;
  adresseMail: string;
  motDePasse: string;
  adressePostal: string;
  tel: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly API_URL = environment.apiUrl;

  private authStateSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Vérifier l'état de l'authentification au démarrage
    this.authStateSubject.next(this.hasToken());
  }

  login(loginData: LoginData): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<any>(
      `${this.API_URL}/auth/login`,
      loginData,
      { headers }
    ).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response.user));
          this.authStateSubject.next(true);
        }
      })
    );
  }

  register(registerData: RegisterData): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<any>(
      `${this.API_URL}/auth/register`,
      registerData,
      { headers }
    ).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response.user));
          this.authStateSubject.next(true);
        }
      })
    );
  }

  logout(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        localStorage.clear();
        this.authStateSubject.next(false);
        this.router.navigate(['/auth/login'], { replaceUrl: true });
      })
    );
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_DATA_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getAdminName(): string {
    const user = this.getUser();
    return user?.nom || 'Admin';
  }

  getAdminAvatar(): string {
    return 'assets/images/default-avatar.png';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
