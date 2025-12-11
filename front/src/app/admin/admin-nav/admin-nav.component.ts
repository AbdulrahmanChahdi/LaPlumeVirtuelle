import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminNavComponent {
  navItems = [
    { path: '/admin/dashboard', icon: 'fas fa-chart-line', label: 'Tableau de bord' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Utilisateurs' },
    { path: '/admin/books', icon: 'fas fa-book', label: 'Livres' },
    { path: '/admin/audiobooks', icon: 'fas fa-headphones', label: 'Livres audio' },
    { path: '/admin/podcasts', icon: 'fas fa-podcast', label: 'Podcasts' }
  ];
}
