import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private ordersService: OrdersService, private authService: AuthService) {}

  ngOnInit(): void {
  const userId = this.authService.currentUser?.id;

  if (userId !== undefined && userId !== null) {
    this.ordersService.getOrders(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders = res.orders;
        }
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  } else {
    console.error('User ID is not available');
  }
}

}
