import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      adressePostal: ['', [Validators.required]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      terms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      const formValue = this.registerForm.value;

      const registerData: RegisterData = {
        nom: formValue.nom,
        adresseMail: formValue.email,
        motDePasse: formValue.password,
        adressePostal: formValue.adressePostal,
        tel: formValue.tel
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.router.navigate(['/auth/register-success'], {
            queryParams: { email: formValue.email }
          });
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          this.isLoading = false;
          if (error.status === 409) {
            this.errorMessage = 'Un utilisateur avec cet email existe déjà';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
