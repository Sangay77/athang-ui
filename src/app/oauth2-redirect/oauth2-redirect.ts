// src/app/components/oauth2-redirect/oauth2-redirect.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  fullName?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-oauth2-redirect',
  templateUrl: './oauth2-redirect.html',
  styleUrls: ['./oauth2-redirect.css']
})
export class Oauth2RedirectComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token);

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Decoded Token+++++:', decoded);
        const username = decoded.sub || decoded.fullName || 'Unknown';
        localStorage.setItem('user', JSON.stringify({ username }));
        console.log('OAuth2 Login - Username:', username);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }

      this.router.navigate(['/dashboard']);
    } else {
      console.warn('No token found in URL');
      this.router.navigate(['/dashboard']);
    }
  }
}
