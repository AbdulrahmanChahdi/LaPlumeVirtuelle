import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

interface Stats {
  livres: number;
  livresAudio: number;
  podcasts: number;
}

interface Activity {
  icon: string;
  title: string;
  description: string;
  date: Date;
}

interface Recommendation {
  image: string;
  title: string;
  author: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userInfo: User | null = null;
  stats: Stats = {
    livres: 0,
    livresAudio: 0,
    podcasts: 0
  };
  recentActivity: Activity[] = [];
  recommendations: Recommendation[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userInfo = this.authService.getUser();

    this.loadStats();
    this.loadRecentActivity();
    this.loadRecommendations();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private loadStats(): void {
    this.stats = {
      livres: 12,
      livresAudio: 5,
      podcasts: 8
    };
  }

  private loadRecentActivity(): void {
    this.recentActivity = [
      {
        icon: 'fas fa-book',
        title: 'Lecture en cours',
        description: 'Vous avez commencé à lire "Le Petit Prince"',
        date: new Date()
      },
      {
        icon: 'fas fa-headphones',
        title: 'Écoute terminée',
        description: 'Vous avez terminé d\'écouter "Les Misérables"',
        date: new Date(Date.now() - 86400000)
      }
    ];
  }

  private loadRecommendations(): void {
    this.recommendations = [
      {
        image: 'assets/images/book1.jpg',
        title: 'L\'Étranger',
        author: 'Albert Camus'
      },
      {
        image: 'assets/images/book2.jpg',
        title: '1984',
        author: 'George Orwell'
      },
      {
        image: 'assets/images/book3.jpg',
        title: 'Madame Bovary',
        author: 'Gustave Flaubert'
      }
    ];
  }
}
