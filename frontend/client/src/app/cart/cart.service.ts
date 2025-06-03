import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  // New: BehaviorSubject to hold current cart items
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Update cart items observable on new data
  private updateCartItems(items: any[]) {
    this.cartItemsSubject.next(items);
  }

  getCart(userId: number): Observable<any> {
    return this.http.get<{cart: any[]}>(`${this.apiUrl}?user_id=${userId}`).pipe(
      tap(res => this.updateCartItems(res.cart))
    );
  }

  addToCart(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, {
      user_id: userId,
      product_id: productId,
      quantity: quantity
    }).pipe(
      tap(() => {
        // Refresh cart after add
        this.getCart(userId).subscribe();
      })
    );
  }

  removeFromCart(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}?user_id=${userId}`).pipe(
      tap(() => {
        // Refresh cart after remove
        this.getCart(userId).subscribe();
      })
    );
  }

  checkout(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, { user_id: userId }).pipe(
      tap(() => this.updateCartItems([])) // Clear cart on checkout
    );
  }
}
