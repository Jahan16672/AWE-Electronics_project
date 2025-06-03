import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, Customer, Staff } from '../user/user.model';

@Injectable({ providedIn: 'root' }) //decorator makes authservice available globally
export class AuthService {
  private apiUrl = 'http://localhost:3000/login'; //setting api url for backend login endpoint

  constructor(private http: HttpClient, private router: Router) {} //constructor injects HttpClient to make HTTP requests
  //router helps navigate to different routes

  login(email: string, password: string): Observable<any> {//defining method to log the user in - using email and pw as parameters
  return this.http.post<any>(this.apiUrl, { email, password }).pipe( //sends post request to backend with email and password
    tap((res) => { //tap runs side effects (eg storing values) without changing observable data
      if (res.token) { //res is the response from the backend
        sessionStorage.setItem('token', res.token); //storing token in session storage
      }
      localStorage.setItem('user', JSON.stringify(res.user)); //saving user info in local storage
    })
  );
  }

  logout(): void {
    sessionStorage.removeItem('token'); //clears stored token from session storage
    localStorage.removeItem('user'); //clears stored user info from local storage
    this.router.navigate(['/login']); //redirects user to login page after logging out
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); //checks if user is logged in. !! converts value to bool, true if data exists, false if not
  }

  get currentUser(): User | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      // Based on the role, return the appropriate class instance
      if (userData.role === 'customer') {
        return new Customer(userData.id, userData.name, userData.email);
      } else if (userData.role === 'staff') {
        return new Staff(userData.id, userData.name, userData.email);
      }
      // If there's a user but no matching role, or an unknown role, you might return null or a generic User object
      return userData as User; // Fallback to basic User interface
    }
    return null; // No user found
  }

  get role(): 'customer' | 'staff' | 'manager' | '' {
    return this.currentUser?.role || '';
  }
}
