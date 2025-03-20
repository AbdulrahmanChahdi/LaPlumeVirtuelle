import { Component, OnInit } from '@angular/core';
import { ContentService, LivreAudio, Categorie } from '../../services/content.service';

@Component({
  selector: 'app-livres-audio',
  templateUrl: './livres-audio.component.html',
  styleUrls: ['./livres-audio.component.scss']
})
export class LivresAudioComponent implements OnInit {
  livresAudio: LivreAudio[] = [];
  filteredLivresAudio: LivreAudio[] = [];
  categories: Categorie[] = [];
  loading = false;
  error: string | null = null;

  // Filtres
  searchTerm = '';
  selectedCategory = '';
  selectedDuration = '';
  hasActiveFilters = false;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadLivresAudio();
  }

  loadCategories(): void {
    this.contentService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.error = 'Erreur lors du chargement des catégories.';
      }
    });
  }

  loadLivresAudio(): void {
    this.loading = true;
    this.error = null;

    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.selectedCategory) params.categorieId = this.selectedCategory;
    if (this.selectedDuration) params.dureeMax = this.selectedDuration;

    this.contentService.getAllLivresAudio(params).subscribe({
      next: (livresAudio) => {
        this.livresAudio = livresAudio;
        this.filteredLivresAudio = livresAudio;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres audio:', error);
        this.error = 'Erreur lors du chargement des livres audio.';
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.updateFilters();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.updateFilters();
  }

  onDurationChange(duration: string): void {
    this.selectedDuration = duration;
    this.updateFilters();
  }

  updateFilters(): void {
    this.hasActiveFilters = !!(this.searchTerm || this.selectedCategory || this.selectedDuration);
    this.loadLivresAudio();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedDuration = '';
    this.hasActiveFilters = false;
    this.loadLivresAudio();
  }
}
