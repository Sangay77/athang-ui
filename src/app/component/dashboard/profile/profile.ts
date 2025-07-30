import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth'; // Adjust path

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    __email: '',
    __firstName: '',
    __lastName: '',
    __imageUrl: 'assets/profile.jpeg',
  };

  editMode = false;
  successMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = this.authService.getCurrentUser();
    if (storedUser) {
      // Example: You might only have username from token, so adjust accordingly
      this.user.__email = storedUser.email || '';
      this.user.__firstName = storedUser.firstName || storedUser.username || '';
      this.user.__lastName = storedUser.lastName || '';
      // Image URL could be stored similarly or use default
    }
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.successMessage = '';
  }

  saveChanges(): void {
    if (!this.user.__firstName || !this.user.__lastName || !this.user.__email) {
      this.successMessage = 'Please fill in all required fields.';
      return;
    }

    this.editMode = false;
    this.successMessage = 'Profile updated successfully!';
    // TODO: Save changes to backend via service call
  }
}
