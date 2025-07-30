import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl: string = 'http://localhost:8083/api/v1/auth/authenticate';
  
  constructor(private httpClient: HttpClient) {}

  authenticate(email: string, password: string): Observable<string> {
    const body = { email, password };

    return this.httpClient.post<{ token: string }>(this.baseUrl, body).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
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
}
