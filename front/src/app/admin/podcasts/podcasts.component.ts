import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Podcast } from '../../models/podcast.model';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {
  podcasts: Podcast[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPodcasts();
  }

  private loadPodcasts(): void {
    this.loading = true;
    this.adminService.getPodcasts().subscribe({
      next: (podcasts) => {
        this.podcasts = podcasts;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des podcasts';
        this.loading = false;
      }
    });
  }

  deletePodcast(podcastId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce podcast ?')) {
      this.adminService.deletePodcast(podcastId).subscribe({
        next: () => {
          this.loadPodcasts();
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression du podcast';
        }
      });
    }
  }
}
