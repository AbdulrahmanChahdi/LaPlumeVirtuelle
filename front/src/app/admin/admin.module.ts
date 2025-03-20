import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { BooksComponent } from './books/books.component';
import { AudiobooksComponent } from './audiobooks/audiobooks.component';
import { PodcastsComponent } from './podcasts/podcasts.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    BooksComponent,
    AudiobooksComponent,
    PodcastsComponent,
    AdminNavComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
