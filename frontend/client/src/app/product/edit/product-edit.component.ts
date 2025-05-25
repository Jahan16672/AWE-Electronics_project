import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product/product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>{{ isEdit ? 'Edit' : 'Add' }} Product</h2>

    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <label>
        Name:
        <input formControlName="name" />
      </label>
      <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched">
        Name is required.
      </div>

      <label>
        Price:
        <input formControlName="price" type="number" />
      </label>
      <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched">
        Price must be a positive number.
      </div>

      <label>
        Stock:
        <input formControlName="stock" type="number" />
      </label>
      <div *ngIf="productForm.get('stock')?.invalid && productForm.get('stock')?.touched">
        Stock is required and must be 0 or more.
      </div>

      <button type="submit" [disabled]="productForm.invalid">{{ isEdit ? 'Update' : 'Add' }}</button>
      <button type="button" (click)="cancel()">Cancel</button>
    </form>

    <div *ngIf="successMessage" style="color: green; margin-top: 10px;">
      {{ successMessage }}
    </div>
  `,
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {
  productForm: FormGroup;
  isEdit = false;
  productId: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });

    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;

    if (this.isEdit) {
      this.loadProduct(this.productId!);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formValues = this.productForm.value;
    const productData: Product = {
      user_id: 1, // Replace with actual user id from auth service
      name: formValues.name,
      price: formValues.price,
      stock: formValues.stock
    };

    if (this.isEdit && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe(() => {
        this.successMessage = 'Product updated successfully!';
        setTimeout(() => this.router.navigate(['/product']), 1500);
      });
    } else {
      this.productService.addProduct(productData).subscribe(() => {
        this.successMessage = 'Product added successfully!';
        setTimeout(() => this.router.navigate(['/product']), 1500);
      });
    }
  }

  cancel() {
    this.router.navigate(['/product']);
  }
}
