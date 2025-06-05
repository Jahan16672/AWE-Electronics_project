import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: number = 0;
  loading = true;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.userId = currentUser.id;
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.loading = false;
      });
      this.cartService.getCart(this.userId).subscribe(); // initial load
    }
  }

  addQuantity(productId: number): void {
    this.cartService.addToCart(this.userId, productId, 1).subscribe();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(this.userId, productId).subscribe();
  }

  decreaseQuantity(productId: number): void {
    const cartItem = this.cartItems.find(item => item.product_id === productId);
    if (!cartItem || cartItem.quantity <= 1) {
      this.removeItem(productId);
      return;
    }
    this.cartService.addToCart(this.userId, productId, -1).subscribe();
  }

  checkout() {
    this.cartService.checkout(this.userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/orders']);
        }
      },
      error: (err) => {
        console.error('Checkout error', err);
      }
    });
  }

  getTotalPrice(): number {
  return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
}