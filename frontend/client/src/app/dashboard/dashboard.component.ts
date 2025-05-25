import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="dashboard-wrapper">  
    <h2>Welcome to Dashboard</h2>
      <p *ngIf="role === 'staff'">You are logged in as staff.</p>
      <p *ngIf="role === 'customer'">You are logged in as a customer.</p>

      <div class="dashboard-options">
        <a routerLink="/product" class="dashboard-btn">🛍️ View Products</a>
        <a routerLink="/cart" class="dashboard-btn">🛒 View Cart</a>

        <div *ngIf="role === 'staff'">
          <a routerLink="/product/edit" class="dashboard-btn">✏️ Add/Edit Products</a>
        </div>
      </div>

      <button class="dashboard-btn" (click)="logout()">Logout</button>
  </div>
  `,
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
