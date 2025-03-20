import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { BooksComponent } from './books/books.component';
import { PodcastsComponent } from './podcasts/podcasts.component';
import { AudiobooksComponent } from './audiobooks/audiobooks.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'books', component: BooksComponent },
      { path: 'podcasts', component: PodcastsComponent },
      { path: 'audiobooks', component: AudiobooksComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
