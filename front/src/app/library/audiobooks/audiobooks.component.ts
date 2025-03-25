import { Component, OnInit } from '@angular/core';
import { ContentService, LivreAudio, Categorie } from '../../services/content.service';

@Component({
  selector: 'app-audiobooks',
  template: `
    <div class="audiobooks-container">
      <header class="section-header">
        <h1>Livres Audio</h1>
        <div class="filters">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Rechercher un livre audio..."
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
            [(ngModel)]="selectedDuree"
            (change)="onSearch()"
            class="duration-filter"
          >
            <option [ngValue]="null">Toutes les durées</option>
            <option [ngValue]="3">Moins de 3h</option>
            <option [ngValue]="5">Moins de 5h</option>
            <option [ngValue]="10">Moins de 10h</option>
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

      <div class="audiobooks-grid" *ngIf="!loading && !error">
        <div class="audiobook-card" *ngFor="let livre of filteredLivres">
          <div class="audiobook-cover">
            <img [src]="livre.imageUrl" [alt]="livre.titre" />
            <div class="audiobook-overlay">
              <button class="preview-btn" (click)="previewAudiobook(livre)">
                <i class="fas fa-play"></i>
                Écouter un extrait
              </button>
              <button class="add-to-cart-btn" (click)="addToCart(livre)">
                <i class="fas fa-shopping-cart"></i>
                {{ livre.prix }}€
              </button>
            </div>
          </div>
          <div class="audiobook-info">
            <h3>{{ livre.titre }}</h3>
            <p class="author" *ngIf="livre.auteur">
              De {{ livre.auteur.prenom }} {{ livre.auteur.nom }}
            </p>
            <p class="narrator">
              Lu par {{ livre.narrateur }}
            </p>
            <div class="audiobook-meta">
              <span class="duration">
                <i class="fas fa-clock"></i>
                {{ livre.duree }}
              </span>
              <span class="category" *ngIf="livre.categorie">
                <i class="fas fa-tag"></i>
                {{ livre.categorie.nom }}
              </span>
            </div>
            <p class="description">{{ livre.description }}</p>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="!loading && !error && filteredLivres.length === 0">
        Aucun livre audio ne correspond à votre recherche.
      </div>
    </div>
  `,
  styles: [`
    .audiobooks-container {
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

    .audiobooks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .audiobook-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);

        .audiobook-overlay {
          opacity: 1;
        }
      }
    }

    .audiobook-cover {
      position: relative;
      aspect-ratio: 2/3;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .audiobook-overlay {
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

        .add-to-cart-btn {
          background: #2ecc71;
          color: white;
        }
      }
    }

    .audiobook-info {
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        color: #2c3e50;
        margin: 0 0 0.5rem;
      }

      .author, .narrator {
        color: #7f8c8d;
        font-size: 0.9rem;
        margin: 0.25rem 0;
      }

      .audiobook-meta {
        display: flex;
        gap: 1rem;
        margin: 0.5rem 0;
        font-size: 0.9rem;
        color: #7f8c8d;

        i {
          margin-right: 0.25rem;
        }
      }

      .description {
        font-size: 0.9rem;
        color: #34495e;
        margin: 0.5rem 0 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
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
      .audiobooks-container {
        padding: 1rem;
      }

      .filters {
        flex-direction: column;

        select {
          width: 100%;
        }
      }

      .audiobooks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AudiobooksComponent implements OnInit {
  livres: LivreAudio[] = [];
  categories: Categorie[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedCategorieId: number | null = null;
  selectedDuree: number | null = null;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadAudiobooks();
    this.loadCategories();
  }

  loadAudiobooks() {
    this.loading = true;
    this.error = null;

    const params = {
      search: this.searchQuery,
      categorieId: this.selectedCategorieId,
      dureeMax: this.selectedDuree
    };

    this.contentService.getAllLivresAudio(params).subscribe({
      next: (data: LivreAudio[]) => {
        this.livres = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Une erreur est survenue lors du chargement des livres audio.';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  loadCategories() {
    this.contentService.getAllCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;
      },
      error: (err: Error) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  onSearch() {
    this.loadAudiobooks();
  }

  get filteredLivres(): LivreAudio[] {
    return this.livres;
  }

  previewAudiobook(livre: LivreAudio) {
    // Implémenter la logique de prévisualisation
    console.log('Prévisualisation du livre audio:', livre.titre);
  }

  addToCart(livre: LivreAudio) {
    // Implémenter la logique d'ajout au panier
    console.log('Ajout au panier:', livre.titre);
  }
}
