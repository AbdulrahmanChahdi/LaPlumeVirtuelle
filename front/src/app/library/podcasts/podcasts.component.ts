import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';

interface Podcast {
  id: number;
  titre: string;
  description: string;
  auteur: string;
  imageUrl: string;
  duree: string;
  categorie: {
    id: number;
    nom: string;
  };
  datePublication: string;
  nombreEpisodes: number;
}

@Component({
  selector: 'app-podcasts',
  template: `
    <div class="podcasts-container">
      <header class="section-header">
        <h1>Podcasts</h1>
        <div class="filters">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Rechercher un podcast..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            />
          </div>
          <select
            [(ngModel)]="selectedCategorieId"
            (change)="onSearch()"
            class="category-filter"
          >
            <option [ngValue]="null">Toutes les catégories</option>
            <option *ngFor="let categorie of categories" [value]="categorie.id">
              {{ categorie.nom }}
            </option>
          </select>
          <select
            [(ngModel)]="sortBy"
            (change)="onSearch()"
            class="sort-filter"
          >
            <option value="recent">Plus récents</option>
            <option value="popular">Plus populaires</option>
            <option value="episodes">Plus d'épisodes</option>
          </select>
        </div>
      </header>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement...
      </div>

      <div class="podcasts-grid" *ngIf="!loading && !error">
        <div class="podcast-card" *ngFor="let podcast of filteredPodcasts">
          <div class="podcast-cover">
            <img [src]="podcast.imageUrl" [alt]="podcast.titre" />
            <div class="podcast-overlay">
              <button class="preview-btn" (click)="previewPodcast(podcast)">
                <i class="fas fa-play"></i>
                Écouter un extrait
              </button>
              <button class="subscribe-btn" (click)="subscribe(podcast)">
                <i class="fas fa-rss"></i>
                S'abonner
              </button>
            </div>
          </div>
          <div class="podcast-info">
            <h3>{{ podcast.titre }}</h3>
            <p class="author">
              Par {{ podcast.auteur }}
            </p>
            <div class="podcast-meta">
              <span class="episodes">
                <i class="fas fa-list"></i>
                {{ podcast.nombreEpisodes }} épisodes
              </span>
              <span class="duration">
                <i class="fas fa-clock"></i>
                {{ podcast.duree }}
              </span>
              <span class="category" *ngIf="podcast.categorie">
                <i class="fas fa-tag"></i>
                {{ podcast.categorie.nom }}
              </span>
            </div>
            <p class="description">{{ podcast.description }}</p>
            <div class="date">
              <i class="fas fa-calendar"></i>
              {{ formatDate(podcast.datePublication) }}
            </div>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="!loading && !error && filteredPodcasts.length === 0">
        Aucun podcast ne correspond à votre recherche.
      </div>
    </div>
  `,
  styles: [`
    .podcasts-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 1rem;
      }
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      .search-bar {
        flex: 1;
        position: relative;

        i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          font-size: 1rem;

          &:focus {
            outline: none;
            border-color: #3498db;
          }
        }
      }

      select {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 1rem;
        min-width: 200px;
        background-color: white;

        &:focus {
          outline: none;
          border-color: #3498db;
        }
      }
    }

    .podcasts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .podcast-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);

        .podcast-overlay {
          opacity: 1;
        }
      }
    }

    .podcast-cover {
      position: relative;
      aspect-ratio: 1/1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .podcast-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;

        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 2rem;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        .preview-btn {
          background: #3498db;
          color: white;
        }

        .subscribe-btn {
          background: #e74c3c;
          color: white;
        }
      }
    }

    .podcast-info {
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        color: #2c3e50;
        margin: 0 0 0.5rem;
      }

      .author {
        color: #7f8c8d;
        font-size: 0.9rem;
        margin: 0.25rem 0;
      }

      .podcast-meta {
        display: flex;
        gap: 1rem;
        margin: 0.5rem 0;
        flex-wrap: wrap;
        font-size: 0.9rem;
        color: #7f8c8d;

        i {
          margin-right: 0.25rem;
        }
      }

      .description {
        font-size: 0.9rem;
        color: #34495e;
        margin: 0.5rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .date {
        font-size: 0.9rem;
        color: #7f8c8d;
        margin-top: 0.5rem;

        i {
          margin-right: 0.5rem;
        }
      }
    }

    .error-message {
      background: #e74c3c;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
      color: #7f8c8d;

      i {
        font-size: 1.5rem;
      }
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: #7f8c8d;
    }

    @media (max-width: 768px) {
      .podcasts-container {
        padding: 1rem;
      }

      .filters {
        flex-direction: column;

        select {
          width: 100%;
        }
      }

      .podcasts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PodcastsComponent implements OnInit {
  podcasts: Podcast[] = [];
  categories: any[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedCategorieId: number | null = null;
  sortBy = 'recent';

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadPodcasts();
    this.loadCategories();
  }

  loadPodcasts() {
        this.loading = true;
    this.error = null;

    this.contentService.getAllPodcasts().subscribe({
      next: (data: Podcast[]) => {
        this.podcasts = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Une erreur est survenue lors du chargement des podcasts.';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  loadCategories() {
    this.contentService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err: Error) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  onSearch() {
    this.loadPodcasts();
  }

  get filteredPodcasts(): Podcast[] {
    let filtered = [...this.podcasts];

    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(podcast =>
        podcast.titre.toLowerCase().includes(search) ||
        podcast.auteur.toLowerCase().includes(search) ||
        podcast.description.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategorieId) {
      filtered = filtered.filter(podcast =>
        podcast.categorie.id === this.selectedCategorieId
      );
    }

    // Tri des podcasts
    switch (this.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime());
        break;
      case 'episodes':
        filtered.sort((a, b) => b.nombreEpisodes - a.nombreEpisodes);
        break;
      // Le tri par popularité nécessiterait un champ supplémentaire dans l'API
    }

    return filtered;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  previewPodcast(podcast: Podcast) {
    // Implémenter la logique de prévisualisation
    console.log('Prévisualisation du podcast:', podcast.titre);
  }

  subscribe(podcast: Podcast) {
    // Implémenter la logique d'abonnement
    console.log('Abonnement au podcast:', podcast.titre);
  }
}
