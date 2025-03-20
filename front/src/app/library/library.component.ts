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
  activeTab: 'books' | 'audiobooks' | 'podcasts' = 'books';

  books: Book[] = [
    {
      id: 1,
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      description: 'Un conte poétique qui aborde les thèmes de l'amour, l'amitié, et le sens de la vie à travers les voyages d'un jeune prince venu d'une autre planète.',
      price: 9.99,
      image: 'assets/images/petit-prince.jpg'
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      description: 'Une dystopie qui dépeint une société totalitaire où la surveillance de masse et la manipulation de l'information sont omniprésentes.',
      price: 12.99,
      image: 'assets/images/1984.jpg'
    },
    {
      id: 3,
      title: 'L\'Étranger',
      author: 'Albert Camus',
      description: 'Un roman existentialiste qui suit Meursault, un homme détaché de la société, confronté à l'absurdité de l'existence.',
      price: 11.99,
      image: 'assets/images/etranger.jpg'
    }
  ];

  audiobooks: Audiobook[] = [
    {
      id: 1,
      title: 'Les Misérables',
      author: 'Victor Hugo',
      narrator: 'Jean Dujardin',
      description: 'L\'histoire épique de Jean Valjean, un ancien forçat qui tente de se racheter dans la France du XIXe siècle.',
      duration: '24h 30min',
      price: 19.99,
      image: 'assets/images/miserables.jpg'
    },
    {
      id: 2,
      title: 'Notre-Dame de Paris',
      author: 'Victor Hugo',
      narrator: 'Guillaume Canet',
      description: 'Une fresque médiévale qui raconte l\'histoire d\'amour tragique entre la belle Esmeralda et le difforme Quasimodo.',
      duration: '18h 45min',
      price: 17.99,
      image: 'assets/images/notre-dame.jpg'
    },
    {
      id: 3,
      title: 'Madame Bovary',
      author: 'Gustave Flaubert',
      narrator: 'Marion Cotillard',
      description: 'Le portrait d\'Emma Bovary, une femme qui cherche à échapper à l\'ennui de sa vie provinciale à travers des relations passionnées.',
      duration: '12h 15min',
      price: 15.99,
      image: 'assets/images/bovary.jpg'
    }
  ];

  podcasts: Podcast[] = [
    {
      id: 1,
      title: 'Histoire en Direct',
      creator: 'Marc Durant',
      description: 'Un podcast qui vous fait revivre les grands moments de l\'histoire comme si vous y étiez.',
      episodeCount: 45,
      price: 4.99,
      image: 'assets/images/histoire.jpg'
    },
    {
      id: 2,
      title: 'Science & Avenir',
      creator: 'Sophie Martin',
      description: 'Explorez les dernières découvertes scientifiques et les innovations technologiques qui façonnent notre futur.',
      episodeCount: 32,
      price: 3.99,
      image: 'assets/images/science.jpg'
    },
    {
      id: 3,
      title: 'Culture & Société',
      creator: 'Pierre Dubois',
      description: 'Une analyse approfondie des phénomènes culturels et sociétaux contemporains.',
      episodeCount: 28,
      price: 4.99,
      image: 'assets/images/culture.jpg'
    }
  ];

  setActiveTab(tab: 'books' | 'audiobooks' | 'podcasts') {
    this.activeTab = tab;
  }
}
