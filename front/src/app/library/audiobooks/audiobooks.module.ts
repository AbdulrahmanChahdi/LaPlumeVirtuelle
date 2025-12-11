import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AudiobooksComponent } from './audiobooks.component';

const routes: Routes = [
  {
    path: '',
    component: AudiobooksComponent
  }
];

@NgModule({
  declarations: [AudiobooksComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AudiobooksModule { }
