import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
  return this.http.post<any>(this.apiUrl, { email, password }).pipe(
    tap((res) => {
      if (res.token) {
        sessionStorage.setItem('token', res.token);
      }
      localStorage.setItem('user', JSON.stringify(res.user));
    })
  );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  get role(): string {
    return this.currentUser?.role || '';
  }
}
