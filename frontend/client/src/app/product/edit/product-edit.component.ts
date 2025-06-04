import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product/product.service';
import { Product } from '../product.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  isEdit = false;
  productId: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;

    if (this.isEdit) {
      this.loadProduct(this.productId!);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        stock: product.stock
      });
    });
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formValues = this.productForm.value;
    const userId = this.authService.currentUser?.id;

    if (!userId) {
    alert('User not logged in. Cannot add or update product.');
    return;
  }
    const productData = {
      user_id: userId,
      name: formValues.name,
      price: formValues.price,
      stock: formValues.stock
    };

    console.log('Submitting product:', productData);


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
