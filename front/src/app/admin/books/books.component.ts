import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Livre } from '../../models/livre.model';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books: Livre[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.loading = true;
    this.adminService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des livres';
        this.loading = false;
      }
    });
  }

  deleteBook(bookId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.adminService.deleteBook(bookId).subscribe({
        next: () => {
          this.loadBooks();
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression du livre';
        }
      });
    }
  }
}
