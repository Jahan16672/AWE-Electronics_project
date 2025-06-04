import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

// Interface to match the API response shape
interface ProductsResponse {
  success: boolean;
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<{ success: boolean, product: Product }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.product)
    );
  }

  addProduct(product: Product & { user_id: number }) {
  return this.http.post(this.apiUrl, product);
}

  updateProduct(id: string, product: Product): Observable<any> {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      return this.http.put(`${this.apiUrl}/${id}?user_id=${currentUser.id}`, product);
    }
    return new Observable(observer => {
      observer.error('User not authenticated');
    });
  }

  deleteProduct(id: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/${id}?user_id=${userId}`);
  }
}