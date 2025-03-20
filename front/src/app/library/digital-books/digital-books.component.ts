import { Component, OnInit } from '@angular/core';
import { LibraryService, Livre, Categorie } from '../../services/library.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-digital-books',
  templateUrl: './digital-books.component.html',
  styleUrls: ['./digital-books.component.scss']
})
export class DigitalBooksComponent implements OnInit {
  searchQuery: string = '';
  selectedCategorieId: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  livresPerPage: number = 12;
  livres: Livre[] = [];
  categories: Categorie[] = [];
  loading: boolean = false;
  error: string | null = null;

  private searchSubject = new Subject<void>();

  constructor(private libraryService: LibraryService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        this.loading = true;
        return this.libraryService.searchLivres(this.searchQuery, this.selectedCategorieId || undefined);
      })
    ).subscribe({
      next: (livres) => {
        this.livres = livres;
        this.totalPages = Math.ceil(livres.length / this.livresPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des livres:', error);
        this.error = 'Une erreur est survenue lors de la recherche des livres.';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadLivres();
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

  loadLivres(): void {
    this.loading = true;
    this.libraryService.getLivres().subscribe({
      next: (livres) => {
        this.livres = livres;
        this.totalPages = Math.ceil(livres.length / this.livresPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.error = 'Une erreur est survenue lors du chargement des livres.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next();
  }

  get filteredLivres(): Livre[] {
    const startIndex = (this.currentPage - 1) * this.livresPerPage;
    return this.livres.slice(startIndex, startIndex + this.livresPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  previewLivre(livre: Livre): void {
    // Implémenter la logique d'aperçu
    console.log('Preview livre:', livre.titre);
  }

  addToCart(livre: Livre): void {
    // Implémenter la logique d'ajout au panier
    console.log('Add to cart:', livre.titre);
  }
}
