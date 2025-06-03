import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service'; // Adjust path as needed
import { CommonModule } from '@angular/common';

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

  constructor(private cartService: CartService, private authService: AuthService) {}

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

  checkout(): void {
    this.cartService.checkout(this.userId).subscribe(() => {
      alert('Checkout successful!');
    });
  }
}