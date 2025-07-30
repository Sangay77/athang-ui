import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
 email = '';
  password = '';
  jwtToken: string | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    this.error = null;

    // Basic validation
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Email and password are required.';
      return;
    }

    this.isLoading = true;

    this.authService.authenticate(this.email.trim(), this.password).subscribe({
      next: (jwtToken) => {
        this.isLoading = false;
        this.jwtToken = jwtToken;
        localStorage.setItem('jwtToken', jwtToken);
        console.log('Login successful, jwtToken:', jwtToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login failed:', err);
        this.error = 'Login failed. Please check your credentials and try again.';
      }
    });
  }
  loginWithGoogle(): void {

    window.location.href = 'http://localhost:8083/api/v1/oauth2/authorization/my-idp'

  }
}
