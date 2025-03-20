import { Component, OnInit } from '@angular/core';
import { LibraryService, LivreAudio, Categorie } from '../../services/library.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-audiobooks',
  templateUrl: './audiobooks.component.html',
  styleUrls: ['./audiobooks.component.scss']
})
export class AudiobooksComponent implements OnInit {
  searchQuery: string = '';
  selectedCategorieId: number | null = null;
  selectedDuree: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  livresAudioPerPage: number = 12;
  livresAudio: LivreAudio[] = [];
  categories: Categorie[] = [];
  loading: boolean = false;
  error: string | null = null;

  durees: string[] = ['< 1h', '1-3h', '3-6h', '6-10h', '> 10h'];

  private searchSubject = new Subject<void>();

  constructor(private libraryService: LibraryService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        this.loading = true;
        return this.libraryService.searchLivresAudio(
          this.searchQuery,
          this.selectedCategorieId || undefined,
          this.selectedDuree || undefined
        );
      })
    ).subscribe({
      next: (livresAudio) => {
        this.livresAudio = livresAudio;
        this.totalPages = Math.ceil(livresAudio.length / this.livresAudioPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des livres audio:', error);
        this.error = 'Une erreur est survenue lors de la recherche des livres audio.';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadLivresAudio();
  }

  loadCategories(): void {
    this.libraryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  loadLivresAudio(): void {
    this.loading = true;
    this.libraryService.getLivresAudio().subscribe({
      next: (livresAudio) => {
        this.livresAudio = livresAudio;
        this.totalPages = Math.ceil(livresAudio.length / this.livresAudioPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres audio:', error);
        this.error = 'Une erreur est survenue lors du chargement des livres audio.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next();
  }

  get filteredLivresAudio(): LivreAudio[] {
    const startIndex = (this.currentPage - 1) * this.livresAudioPerPage;
    return this.livresAudio.slice(startIndex, startIndex + this.livresAudioPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  playLivreAudio(livreAudio: LivreAudio): void {
    // Implémenter la logique de lecture
    console.log('Lecture du livre audio:', livreAudio.titre);
  }

  addToCart(livreAudio: LivreAudio): void {
    // Implémenter la logique d'ajout au panier
    console.log('Ajout au panier:', livreAudio.titre);
  }
}
