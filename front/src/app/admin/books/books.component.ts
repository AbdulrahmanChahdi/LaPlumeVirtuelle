import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LivreService, Livre } from '../../services/livre.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="books-container">
      <div class="header">
        <h1>Gestion des Livres</h1>
        <button class="btn-add" routerLink="new">
          <i class="fas fa-plus"></i>
          Ajouter un livre
        </button>
      </div>

      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Rechercher un livre..."
          class="search-input"
        >
        <select
          [(ngModel)]="selectedCategory"
          (change)="onCategoryChange()"
          class="category-select"
        >
          <option value="">Toutes les catégories</option>
          <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.nom }}</option>
        </select>
      </div>

      <div class="books-table">
        <table>
          <thead>
            <tr>
              <th>Couverture</th>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let livre of filteredLivres">
              <td>
                <img [src]="livre.couverture_url" [alt]="livre.titre" class="book-cover">
              </td>
              <td>{{ livre.titre }}</td>
              <td>{{ livre.auteur.nom }} {{ livre.auteur.prenom }}</td>
              <td>{{ livre.categorie.nom }}</td>
              <td>{{ livre.prix }} €</td>
              <td class="actions">
                <button class="btn-edit" [routerLink]="[livre.id, 'edit']">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" (click)="deleteLivre(livre.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button
          *ngFor="let page of getPages()"
          [class.active]="currentPage === page"
          (click)="changePage(page)"
        >
          {{ page }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .books-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 1.5rem;
        color: #111827;
      }
    }

    .btn-add {
      background-color: #111827;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #1f2937;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      i {
        font-size: 1rem;
      }
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      .search-input, .category-select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        min-width: 200px;
      }
    }

    .books-table {
      overflow-x: auto;

      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }

        .book-cover {
          width: 50px;
          height: 70px;
          object-fit: cover;
          border-radius: 0.25rem;
        }

        .actions {
          display: flex;
          gap: 0.5rem;

          button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: background 0.3s ease;

            &.btn-edit {
              color: #3498db;

              &:hover {
                background: rgba(52, 152, 219, 0.1);
              }
            }

            &.btn-delete {
              color: #e74c3c;

              &:hover {
                background: rgba(231, 76, 60, 0.1);
              }
            }
          }
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;

      button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 0.25rem;
        transition: all 0.3s ease;

        &.active {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }

        &:hover:not(.active) {
          background: #f8f9fa;
        }
      }
    }
  `]
})
export class BooksComponent implements OnInit {
  livres: Livre[] = [];
  filteredLivres: Livre[] = [];
  searchQuery: string = '';
  selectedCategory: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  categories: any[] = [];

  constructor(private livreService: LivreService) {}

  ngOnInit(): void {
    this.loadLivres();
    this.loadCategories();
  }

  loadLivres(): void {
    this.livreService.getAllLivres().subscribe({
      next: (data) => {
        this.livres = data;
        this.filterLivres();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
      }
    });
  }

  loadCategories(): void {
    // Implémenter le chargement des catégories
  }

  filterLivres(): void {
    this.filteredLivres = this.livres.filter(livre => {
      const matchesSearch = !this.searchQuery ||
        livre.titre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        `${livre.auteur.nom} ${livre.auteur.prenom}`.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = !this.selectedCategory ||
        livre.categorie_id === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    this.totalPages = Math.ceil(this.filteredLivres.length / this.itemsPerPage);
  }

  onSearch(): void {
    this.filterLivres();
  }

  onCategoryChange(): void {
    this.filterLivres();
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  deleteLivre(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.livreService.deleteLivre(id).subscribe({
        next: () => {
          this.loadLivres();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du livre:', error);
        }
      });
    }
  }
}
