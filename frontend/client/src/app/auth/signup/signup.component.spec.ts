import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private signupService: SignupService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[^0-9]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)]],
      confirmPassword: ['', Validators.required],
      role: ['customer']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { confirmPassword, ...formValue } = this.signupForm.value;
      this.signupService.signup(formValue).subscribe({
        next: res => alert('Signup successful'),
        error: err => alert('Signup failed: ' + err.error.message)
      });
    }
  }
}