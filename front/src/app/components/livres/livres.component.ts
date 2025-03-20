import { Component, OnInit } from '@angular/core';
import { ContentService, Livre, Categorie } from '../../services/content.service';

@Component({
  selector: 'app-livres',
  templateUrl: './livres.component.html',
  styleUrls: ['./livres.component.scss']
})
export class LivresComponent implements OnInit {
  livres: Livre[] = [];
  categories: Categorie[] = [];
  selectedCategory: number | null = null;
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadLivres();
  }

  loadCategories(): void {
    this.contentService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.error = 'Erreur lors du chargement des catégories.';
      }
    });
  }

  loadLivres(): void {
    this.loading = true;
    this.error = null;

    this.contentService.getAllLivres().subscribe({
      next: (data) => {
        console.log('Livres chargés:', data);
        this.livres = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.error = 'Une erreur est survenue lors du chargement des livres.';
        this.loading = false;
      }
    });
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId ? parseInt(categoryId) : null;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
  }

  get filteredLivres(): Livre[] {
    return this.livres.filter(livre => {
      const matchCategory = !this.selectedCategory || livre.categorie.id === this.selectedCategory;
      const searchLower = this.searchTerm.toLowerCase();
      const matchSearch = !this.searchTerm ||
        livre.titre.toLowerCase().includes(searchLower) ||
        livre.auteur.nom.toLowerCase().includes(searchLower) ||
        livre.resume.toLowerCase().includes(searchLower);
      return matchCategory && matchSearch;
    });
  }
}
