import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { Livre } from '../../models/livre.model';
import { LivreAudio } from '../../models/livre-audio.model';
import { Podcast } from '../../models/podcast.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    users: 0,
    books: 0,
    audiobooks: 0,
    podcasts: 0
  };

  recentUsers: User[] = [];
  recentBooks: Livre[] = [];
  recentAudiobooks: LivreAudio[] = [];
  recentPodcasts: Podcast[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Charger les statistiques
    this.adminService.getUsers().subscribe(users => {
      this.stats.users = users.length;
      this.recentUsers = users.slice(0, 5);
    });

    this.adminService.getBooks().subscribe(books => {
      this.stats.books = books.length;
      this.recentBooks = books.slice(0, 5);
    });

    this.adminService.getAudiobooks().subscribe(audiobooks => {
      this.stats.audiobooks = audiobooks.length;
      this.recentAudiobooks = audiobooks.slice(0, 5);
    });

    this.adminService.getPodcasts().subscribe(podcasts => {
      this.stats.podcasts = podcasts.length;
      this.recentPodcasts = podcasts.slice(0, 5);
    });
  }

  // Gestion des utilisateurs
  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.loadDashboardData();
      });
    }
  }

  // Gestion des livres
  editBook(bookId: number): void {
    this.router.navigate(['/admin/books', bookId, 'edit']);
  }

  deleteBook(bookId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.adminService.deleteBook(bookId).subscribe(() => {
        this.loadDashboardData();
      });
    }
  }

  // Gestion des livres audio
  editAudiobook(audiobookId: number): void {
    this.router.navigate(['/admin/audiobooks', audiobookId, 'edit']);
  }

  deleteAudiobook(audiobookId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre audio ?')) {
      this.adminService.deleteAudiobook(audiobookId).subscribe(() => {
        this.loadDashboardData();
      });
    }
  }

  // Gestion des podcasts
  editPodcast(podcastId: number): void {
    this.router.navigate(['/admin/podcasts', podcastId, 'edit']);
  }

  deletePodcast(podcastId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce podcast ?')) {
      this.adminService.deletePodcast(podcastId).subscribe(() => {
        this.loadDashboardData();
      });
    }
  }
}
