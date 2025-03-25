import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'livres',
        loadChildren: () => import('./books/books.module').then(m => m.BooksModule)
      },
      {
        path: 'livres-audio',
        loadChildren: () => import('./audiobooks/audiobooks.module').then(m => m.AudiobooksModule)
      },
      {
        path: 'podcasts',
        loadChildren: () => import('./podcasts/podcasts.module').then(m => m.PodcastsModule)
      },
      {
        path: 'utilisateurs',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
