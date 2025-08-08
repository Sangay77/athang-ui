import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      photos: [null]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();

      // Create JSON DTO object
      const userDto = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName
      };

      // Append JSON as blob with key 'request'
      formData.append('request', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));

      // Append file as 'photo'
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          this.successMessage = 'Registered successfully! Please login.';
          this.errorMessage = '';
          this.registerForm.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.successMessage = '';
    }
  }
}
