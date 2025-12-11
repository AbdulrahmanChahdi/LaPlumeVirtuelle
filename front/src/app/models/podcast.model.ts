import { Auteur, Categorie } from './livre.model';

export interface Podcast {
  id: number;
  titre: string;
  auteur: Auteur;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duree: string;
  datePublication: string;
  categorie: Categorie;
  langue: string;
  tags: string[];
  episodes: Episode[];
}

export interface Episode {
  id: number;
  titre: string;
  description: string;
  duree: string;
  audioUrl: string;
  datePublication: string;
  numero: number;
}
