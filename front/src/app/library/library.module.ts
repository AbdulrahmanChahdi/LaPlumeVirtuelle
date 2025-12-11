import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LibraryComponent } from './library.component';
import { DigitalBooksComponent } from './digital-books/digital-books.component';
import { LibraryRoutingModule } from './library-routing.module';
import { LivreService } from '../services/livre.service';

@NgModule({
  declarations: [
    LibraryComponent,
    DigitalBooksComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    LibraryRoutingModule
  ],
  providers: [
    LivreService
  ]
})
export class LibraryModule { }
