import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './product/product.service';
import { Product } from './product.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { RouterModule } from '@angular/router';

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

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
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
    const userId = this.authService.currentUser.id.toString();;

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
}
