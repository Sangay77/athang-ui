import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [RouterModule, CommonModule]
})
export class DashBoardComponent implements OnInit {
  username: string = 'Guest';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.username) {
      this.username = user.username;
    }
  }

 

  logout(): void {
    this.authService.logout();
  }
}
