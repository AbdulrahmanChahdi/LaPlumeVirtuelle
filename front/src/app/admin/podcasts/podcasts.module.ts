import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PodcastsComponent } from './podcasts.component';

const routes: Routes = [
  {
    path: '',
    component: PodcastsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PodcastsModule { }
