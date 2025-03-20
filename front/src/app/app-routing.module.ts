import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalBooksComponent } from './library/digital-books/digital-books.component';
import { PodcastsComponent } from './library/podcasts/podcasts.component';
import { AudiobooksComponent } from './library/audiobooks/audiobooks.component';
import { LivresComponent } from './components/livres/livres.component';

const routes: Routes = [
  { path: '', redirectTo: '/livres', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'library/books', component: DigitalBooksComponent },
  { path: 'library/podcasts', component: PodcastsComponent },
  { path: 'library/audiobooks', component: AudiobooksComponent },
  { path: 'livres', component: LivresComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
