import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudiobooksComponent } from './audiobooks.component';

const routes: Routes = [
  {
    path: '',
    component: AudiobooksComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AudiobooksModule { }
