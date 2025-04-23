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
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private authStateSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    this.authStateSubject.next(!!token);
  }

  isLoggedIn(): boolean {
    return this.authStateSubject.value;
  }

  register(registerData: RegisterData): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<any>(
      `${this.API_URL}/auth/register`,
      registerData,
      { headers }
    );
  }

  logout(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_DATA_KEY);
        this.authStateSubject.next(false);
        this.router.navigate(['/auth/login']);
      })
    );
  }
}
