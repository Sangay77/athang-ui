import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

   private baseUrl = 'http://localhost:8083/api/v1';

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  bookTicket(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/auth/test`, { withCredentials: true });
  }
  
}
