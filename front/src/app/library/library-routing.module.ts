import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalBooksComponent } from './digital-books/digital-books.component';
import { LibraryComponent } from './library.component';

const routes: Routes = [
  {
    path: '',
    component: LibraryComponent,
    children: [
      { path: 'digital-books', component: DigitalBooksComponent },
      { path: 'audiobooks', loadChildren: () => import('./audiobooks/audiobooks.module').then(m => m.AudiobooksModule) },
      { path: 'podcasts', loadChildren: () => import('./podcasts/podcasts.module').then(m => m.PodcastsModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
