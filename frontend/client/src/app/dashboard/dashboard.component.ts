import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  role: string = '';

  constructor(private auth: AuthService) {
  this.role = this.auth.role;
  // console.log('Logged in user role:', this.role);
}

  logout() {
    this.auth.logout();
  }
}
