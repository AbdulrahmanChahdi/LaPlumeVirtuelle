import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastsComponent } from './podcasts.component';

const routes: Routes = [
  {
    path: '',
    component: PodcastsComponent
  }
];

@NgModule({
  declarations: [PodcastsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PodcastsModule { }
