import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {
  message: string = '';
  type: 'success' | 'error' = 'success';
  redirectPath: string = '/auth/login';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'register') {
        this.message = 'Votre inscription a été validée avec succès ! Vous pouvez maintenant vous connecter.';
        this.type = 'success';
        this.redirectPath = '/auth/login';
      } else if (params['type'] === 'login') {
        this.message = 'Connexion réussie ! Vous allez être redirigé vers le tableau de bord.';
        this.type = 'success';
        this.redirectPath = '/dashboard';
      } else {
        this.message = 'Une erreur est survenue.';
        this.type = 'error';
        this.redirectPath = '/auth/login';
      }

      // Redirection après 3 secondes
      setTimeout(() => {
        this.router.navigate([this.redirectPath]);
      }, 3000);
    });
  }
}
