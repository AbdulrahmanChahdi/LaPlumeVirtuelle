import { Component } from '@angular/core';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

interface Audiobook {
  id: number;
  title: string;
  author: string;
  narrator: string;
  description: string;
  duration: string;
  price: number;
  image: string;
}

interface Podcast {
  id: number;
  title: string;
  creator: string;
  description: string;
  episodeCount: number;
  price: number;
  image: string;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent {
  // Le composant est maintenant géré par le router
}
