import { Component, OnInit } from '@angular/core';

interface DashboardStats {
  users: number;
  books: number;
  audiobooks: number;
  podcasts: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  date: Date;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Tableau de bord</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-info">
            <h3>Utilisateurs</h3>
            <p>{{ stats.users }}</p>
          </div>
        </div>

        <div class="stat-card">
          <i class="fas fa-book"></i>
          <div class="stat-info">
            <h3>Livres</h3>
            <p>{{ stats.books }}</p>
          </div>
        </div>

        <div class="stat-card">
          <i class="fas fa-headphones"></i>
          <div class="stat-info">
            <h3>Livres Audio</h3>
            <p>{{ stats.audiobooks }}</p>
          </div>
        </div>

        <div class="stat-card">
          <i class="fas fa-podcast"></i>
          <div class="stat-info">
            <h3>Podcasts</h3>
            <p>{{ stats.podcasts }}</p>
          </div>
        </div>
      </div>

      <section class="recent-activity">
        <h2>Activité récente</h2>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivities" class="activity-item">
            <div class="activity-icon" [ngClass]="activity.type">
              <i class="fas" [ngClass]="{
                'fa-book': activity.type === 'book',
                'fa-headphones': activity.type === 'audiobook',
                'fa-podcast': activity.type === 'podcast',
                'fa-user': activity.type === 'user'
              }"></i>
            </div>
            <div class="activity-details">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.date | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <span class="activity-status" [ngClass]="activity.status">
              {{ activity.status }}
            </span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: #2c3e50;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;

      i {
        font-size: 2rem;
        color: #3498db;
      }

      .stat-info {
        h3 {
          margin: 0;
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        p {
          margin: 0.5rem 0 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
      }
    }

    .recent-activity {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      h2 {
        margin: 0 0 1.5rem;
        color: #2c3e50;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 0.5rem;

      .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        &.book { background: #3498db; }
        &.audiobook { background: #e74c3c; }
        &.podcast { background: #2ecc71; }
        &.user { background: #f1c40f; }
      }

      .activity-details {
        flex: 1;

        h4 {
          margin: 0;
          color: #2c3e50;
        }

        p {
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
          color: #7f8c8d;
        }
      }

      .activity-status {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;

        &.success { background: #2ecc71; color: white; }
        &.pending { background: #f1c40f; color: white; }
        &.error { background: #e74c3c; color: white; }
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .activity-item {
        flex-direction: column;
        text-align: center;

        .activity-icon {
          margin: 0 auto;
        }

        .activity-status {
          margin-top: 0.5rem;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    users: 0,
    books: 0,
    audiobooks: 0,
    podcasts: 0
  };

  recentActivities: RecentActivity[] = [];

  ngOnInit() {
    // Simuler le chargement des données
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Simuler des statistiques
    this.stats = {
      users: 1250,
      books: 450,
      audiobooks: 180,
      podcasts: 95
    };

    // Simuler l'activité récente
    this.recentActivities = [
      {
        id: 1,
        type: 'book',
        title: 'Nouveau livre ajouté : "Le Petit Prince"',
        date: new Date(),
        status: 'success'
      },
      {
        id: 2,
        type: 'audiobook',
        title: 'Mise à jour du livre audio : "1984"',
        date: new Date(Date.now() - 3600000),
        status: 'pending'
      },
      {
        id: 3,
        type: 'user',
        title: 'Nouvel utilisateur inscrit : Jean Dupont',
        date: new Date(Date.now() - 7200000),
        status: 'success'
      },
      {
        id: 4,
        type: 'podcast',
        title: 'Nouveau podcast publié : "Histoire de France"',
        date: new Date(Date.now() - 10800000),
        status: 'success'
      }
    ];
  }
}
