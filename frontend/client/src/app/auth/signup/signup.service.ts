import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://localhost:3000/signup';

  constructor(private http: HttpClient) {}

  signup(data: SignupData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
