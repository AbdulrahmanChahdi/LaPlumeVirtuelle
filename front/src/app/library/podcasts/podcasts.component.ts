import { Component, OnInit } from '@angular/core';
import { LibraryService, Podcast, Categorie } from '../../services/library.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {
  searchQuery: string = '';
  selectedCategorieId: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  podcastsPerPage: number = 12;
  podcasts: Podcast[] = [];
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
        return this.libraryService.searchPodcasts(this.searchQuery, this.selectedCategorieId || undefined);
      })
    ).subscribe({
      next: (podcasts) => {
        this.podcasts = podcasts;
        this.totalPages = Math.ceil(podcasts.length / this.podcastsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des podcasts:', error);
        this.error = 'Une erreur est survenue lors de la recherche des podcasts.';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadPodcasts();
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

  loadPodcasts(): void {
    this.loading = true;
    this.libraryService.getPodcasts().subscribe({
      next: (podcasts) => {
        this.podcasts = podcasts;
        this.totalPages = Math.ceil(podcasts.length / this.podcastsPerPage);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des podcasts:', error);
        this.error = 'Une erreur est survenue lors du chargement des podcasts.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next();
  }

  get filteredPodcasts(): Podcast[] {
    const startIndex = (this.currentPage - 1) * this.podcastsPerPage;
    return this.podcasts.slice(startIndex, startIndex + this.podcastsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  playPodcast(podcast: Podcast): void {
    // Implémenter la logique de lecture
    console.log('Lecture du podcast:', podcast.titre);
  }

  subscribeToPodcast(podcast: Podcast): void {
    // Implémenter la logique d'abonnement
    console.log('Abonnement au podcast:', podcast.titre);
  }
}
