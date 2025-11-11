import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Registration, Role } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  roles = Object.values(Role).filter(role => role !== Role.Admin);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    role: new FormControl(Role.Tourist, [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  register(): void {
    if (this.registrationForm.valid) {
      const registration: Registration = {
        username: this.registrationForm.value.username || "",
        password: this.registrationForm.value.password || "",
        confirmPassword: this.registrationForm.value.confirmPassword || "",
        role: this.registrationForm.value.role || Role.Tourist,
      };

      this.authService.register(registration).subscribe({
        next: () => {
          alert('Registration successful! Please login with your credentials.');
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          alert('Registration failed. Please try again.');
        }
      });
    }
  }
}
