import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginData } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }

    // Vérifier si l'utilisateur vient de s'inscrire
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        if (params['email']) {
          this.loginForm.patchValue({ email: params['email'] });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      const { email, password } = this.loginForm.value;

      const loginData: LoginData = {
        adresseMail: email,
        motDePasse: password
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          if (response && response.token) {
            this.redirectBasedOnRole();
          } else {
            this.errorMessage = 'Réponse du serveur invalide';
            console.error('Réponse invalide:', response);
          }
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 403) {
            this.errorMessage = 'Accès refusé';
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la connexion';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
