import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { LivreAudio } from '../../models/livre-audio.model';

@Component({
  selector: 'app-audiobooks',
  templateUrl: './audiobooks.component.html',
  styleUrls: ['./audiobooks.component.scss']
})
export class AudiobooksComponent implements OnInit {
  audiobooks: LivreAudio[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadAudiobooks();
  }

  private loadAudiobooks(): void {
    this.loading = true;
    this.adminService.getAudiobooks().subscribe({
      next: (audiobooks) => {
        this.audiobooks = audiobooks;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des livres audio';
        this.loading = false;
      }
    });
  }

  deleteAudiobook(audiobookId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre audio ?')) {
      this.adminService.deleteAudiobook(audiobookId).subscribe({
        next: () => {
          this.loadAudiobooks();
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression du livre audio';
        }
      });
    }
  }
}
