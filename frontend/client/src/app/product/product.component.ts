import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './product/product.service';
import { Product } from './product.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart/cart.service';


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
  userId: string = '';
  cartItems: any[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.userId = currentUser.id.toString();
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

  get filteredProducts(): Product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isStaff(): boolean {
    return this.authService.role === 'staff';
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
    const userId = this.authService.currentUser.id.toString();

    this.productService.deleteProduct(id, userId).subscribe({
      next: (res) => {
        console.log('Product deleted', res);
        this.loadProducts();
      },
      error: (err) => {
        console.error('Delete failed:', err);
      }
    });
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
      alert(`Cannot add more than ${product.stock} items for this product.`);
      return;
    }

    this.cartService.addToCart(this.userId, productId, 1).subscribe({
      next: () => alert('Item added to cart'),
      error: (err) => console.error('Add to cart failed:', err)
    });
  }  
}

