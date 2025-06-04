import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private API_URL = 'http://localhost:3000/api/orders'
    
  constructor(private http: HttpClient) {}

  getOrders(userId: number) {
    return this.http.get<any>(`${this.API_URL}/?user_id=${userId}`);
  }
}
