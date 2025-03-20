import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent implements OnInit {
  email: string = '';
  countdown: number = 5;
  private countdownInterval: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true', email: this.email }
        });
      }
    }, 1000);
  }

  goToLogin(): void {
    clearInterval(this.countdownInterval);
    this.router.navigate(['/auth/login'], {
      queryParams: { registered: 'true', email: this.email }
    });
  }
}
