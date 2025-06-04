import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User, Customer, Staff } from '../user/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null; // Initialize as null or undefined

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser;
  }

  isCustomer(): boolean {
    return this.currentUser instanceof Customer;
  }

  isStaff(): boolean {
    return this.currentUser instanceof Staff;
  }

  logout() {
    this.auth.logout();
  }
}