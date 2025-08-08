import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate.account.component.html',
  styleUrls: ['./activate.account.component.css'],
  imports: [CommonModule,FormsModule]
})
export class ActivateAccountComponent {
  token: string = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  activate(): void {
    if (this.token.trim() === '') {
      this.errorMessage = 'Please enter a valid token.';
      return;
    }

    this.authService.activateAccount(this.token).subscribe({
      next: () => {
        this.successMessage = 'Account activated successfully.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.successMessage = '';
        // Try to extract specific error message
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else if (err.error?.businessErrorDescription) {
          this.errorMessage = err.error.businessErrorDescription;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        console.error(err);
      }
    });
  }
}
