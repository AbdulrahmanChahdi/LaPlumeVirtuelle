import { Component, OnInit } from '@angular/core';
import { ContentService, Livre, Categorie } from '../../services/content.service';

@Component({
  selector: 'app-digital-books',
  template: `
    <div class="digital-books-container">
      <header class="section-header">
        <h1>Livres Numériques</h1>
        <div class="filters">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="Rechercher un livre..."
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
            [(ngModel)]="selectedLangue"
            (change)="onSearch()"
            class="language-filter"
          >
            <option [ngValue]="null">Toutes les langues</option>
            <option value="FR">Français</option>
            <option value="EN">Anglais</option>
            <option value="ES">Espagnol</option>
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

      <div class="books-grid" *ngIf="!loading && !error">
        <div class="book-card" *ngFor="let livre of filteredLivres">
          <div class="book-cover">
            <img [src]="livre.imageUrl" [alt]="livre.titre" />
            <div class="book-overlay">
              <button class="preview-btn" (click)="previewBook(livre)">
                <i class="fas fa-book-open"></i>
                Lire un extrait
              </button>
              <button class="add-to-cart-btn" (click)="addToCart(livre)">
                <i class="fas fa-shopping-cart"></i>
                Ajouter au panier
              </button>
            </div>
          </div>
          <div class="book-info">
            <h3>{{ livre.titre }}</h3>
            <p class="author" *ngIf="livre.auteur">
              Par {{ livre.auteur.nom }}
            </p>
            <div class="book-meta">
              <span class="pages">
                <i class="fas fa-file-alt"></i>
                {{ livre.nombreDePage }} pages
              </span>
              <span class="language">
                <i class="fas fa-globe"></i>
                {{ livre.langue }}
              </span>
              <span class="category" *ngIf="livre.categorie">
                <i class="fas fa-tag"></i>
                {{ livre.categorie.nom }}
              </span>
            </div>
            <p class="description">{{ livre.resume }}</p>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="!loading && !error && filteredLivres.length === 0">
        Aucun livre ne correspond à votre recherche.
      </div>
    </div>
  `,
  styles: [`
    .digital-books-container {
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

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .book-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);

        .book-overlay {
          opacity: 1;
        }
      }
    }

    .book-cover {
      position: relative;
      aspect-ratio: 2/3;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .book-overlay {
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

    .book-info {
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

      .book-meta {
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
      .digital-books-container {
        padding: 1rem;
      }

      .filters {
        flex-direction: column;

        select {
          width: 100%;
        }
      }

      .books-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DigitalBooksComponent implements OnInit {
  livres: Livre[] = [];
  categories: Categorie[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedCategorieId: number | null = null;
  selectedLangue: string | null = null;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks() {
    this.loading = true;
    this.error = null;

    this.contentService.getAllLivres().subscribe({
      next: (data: Livre[]) => {
        this.livres = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Une erreur est survenue lors du chargement des livres.';
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
    this.loadBooks();
  }

  get filteredLivres(): Livre[] {
    let filtered = [...this.livres];

    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(livre =>
        livre.titre.toLowerCase().includes(search) ||
        livre.auteur.nom.toLowerCase().includes(search) ||
        livre.resume.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategorieId) {
      filtered = filtered.filter(livre =>
        livre.categorie.id === this.selectedCategorieId
      );
    }

    if (this.selectedLangue) {
      filtered = filtered.filter(livre =>
        livre.langue === this.selectedLangue
      );
    }

    return filtered;
  }

  previewBook(livre: Livre) {
    // Implémenter la logique de prévisualisation
    console.log('Prévisualisation du livre:', livre.titre);
  }

  addToCart(livre: Livre) {
    // Implémenter la logique d'ajout au panier
    console.log('Ajout au panier:', livre.titre);
  }
}
