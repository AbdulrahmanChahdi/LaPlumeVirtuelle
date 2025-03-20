import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DigitalBooksComponent } from './library/digital-books/digital-books.component';
import { PodcastsComponent } from './library/podcasts/podcasts.component';
import { AudiobooksComponent } from './library/audiobooks/audiobooks.component';
import { FooterComponent } from './shared/footer/footer.component';
import { httpInterceptorProviders } from './services/http-interceptors';
import { LivresComponent } from './components/livres/livres.component';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    DigitalBooksComponent,
    PodcastsComponent,
    AudiobooksComponent,
    FooterComponent,
    LivresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
