import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProductComponent } from './product/product.component';
import { ProductEditComponent } from './product/edit/product-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product', component: ProductComponent },
  { path: 'product/edit', component: ProductEditComponent },
  { path: 'product/edit/:id', component: ProductEditComponent },
  { path: '**', redirectTo: '' }
];