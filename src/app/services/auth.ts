// src/app/services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  fullName?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8083/api/v1';

  constructor(private httpClient: HttpClient, private router: Router) {}

  authenticate(email: string, password: string): Observable<string> {
    const body = { email, password };

    return this.httpClient.post<{ token: string }>(`${this.baseUrl}/auth/login`, body, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response && response.token) {

          const decoded = jwtDecode<JwtPayload>(response.token);
          const username = decoded.sub || decoded.fullName || 'Unknown';

          localStorage.setItem('user', JSON.stringify({ username }));
          return response.token;
        } else {
          throw new Error('Authentication failed: No token received');
        }
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }


  getToken(): string | null {
  return localStorage.getItem('token');
}

 logout(): void {
  this.httpClient.post(`${this.baseUrl}/api/v1/logout`, {}, { withCredentials: true }).subscribe({
    next: () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    },
    error: () => {
      this.router.navigate(['/login']);
    }
  });
}

}
