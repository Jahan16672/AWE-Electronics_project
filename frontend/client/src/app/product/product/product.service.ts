import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product.model';

// Interface to match the API response shape
interface ProductsResponse {
  success: boolean;
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }
}