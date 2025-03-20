import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent {
  navItems = [
    { path: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Utilisateurs' },
    { path: '/admin/books', icon: 'fas fa-book', label: 'Livres' },
    { path: '/admin/audiobooks', icon: 'fas fa-headphones', label: 'Livres Audio' },
    { path: '/admin/podcasts', icon: 'fas fa-podcast', label: 'Podcasts' }
  ];
}
