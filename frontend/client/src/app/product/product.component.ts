import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './product/product.service';
import { Product } from './product.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { User, Customer, Staff } from '../user/user.model';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  userId: number = 0;
  cartItems: any[] = [];
  sortField: 'price' | 'stock' | '' = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  successMessages: { [productId: number]: string } = {};

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.userId = currentUser.id;
      // Subscribe to cart items observable
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
      });
      // Optionally load cart initially if needed
      this.cartService.getCart(this.userId).subscribe();
    }

    this.productService.getAllProducts().subscribe(data => {
      this.products = data.products;
    });
  }

  isStaff(): boolean {
    return this.authService.currentUser instanceof Staff;
    // return this.authService.role === 'staff';
  }

  isCustomer(): boolean {
    return this.authService.currentUser instanceof Customer;
    // return this.authService.role === 'staff';
  }

  loadProducts() {
  this.productService.getAllProducts().subscribe({
    next: (res) => {
      this.products = res.products;
    },
    error: (err) => {
      console.error('Failed to load products:', err);
    }
  });
}

  deleteProduct(id: number) {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.productService.deleteProduct(id, currentUser.id).subscribe({
        next: (res) => {
          console.log('Product deleted', res);
          this.loadProducts();
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  addToCart(productId: number): void {
    if (!this.userId) {
      alert('You must be logged in to add items to the cart.');
      return;
    }

    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = this.cartItems.find(item => item.product_id === productId);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    if (currentQuantity + 1 > product.stock) {
      this.successMessages[productId] = `Only ${product.stock} in stock.`;
      setTimeout(() => delete this.successMessages[productId], 3000);
      return;
    }

    this.cartService.addToCart(this.userId, productId, 1).subscribe({
      next: () => {
        this.successMessages[productId] = 'Added to cart!';
        setTimeout(() => delete this.successMessages[productId], 3000);
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.successMessages[productId] = 'Add failed.';
        setTimeout(() => delete this.successMessages[productId], 3000);
      }
    });
  }

   get filteredProducts(): Product[] {
    let filtered = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortField !== '' && this.sortOrder !== '') {
      filtered = filtered.sort((a, b) => {
        const field = this.sortField as 'price' | 'stock';

        const valueA = a[field];
        const valueB = b[field];

        return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }

    return filtered;
  }

}

