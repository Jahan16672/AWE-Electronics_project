import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private signupService: SignupService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2,}(?: [A-Za-z]{2,})*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)]],
      confirmPassword: ['', Validators.required],
      role: ['customer', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid && this.passwordsMatch()) {
      const { confirmPassword, ...formValue } = this.signupForm.value;
      this.signupService.signup(formValue).subscribe({
        next: (res: any) => alert('Signup successful'),
        error: (err: any) => alert('Signup failed: ' + (err.error?.message || err.message))
      });
    } else {
      alert('Form is invalid or passwords do not match');
    }
  }

  passwordsMatch(): boolean {
    return this.signupForm.value.password === this.signupForm.value.confirmPassword;
  }
}