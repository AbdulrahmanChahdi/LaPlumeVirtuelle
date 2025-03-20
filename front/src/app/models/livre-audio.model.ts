import { Auteur, Categorie } from './livre.model';

export interface LivreAudio {
  id: number;
  titre: string;
  auteur: Auteur;
  narrateur: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duree: string;
  datePublication: string;
  categorie: Categorie;
  langue: string;
  format: string;
  disponible: boolean;
  chapitres: Chapitre[];
}

export interface Chapitre {
  id: number;
  titre: string;
  duree: string;
  position: number;
  audioUrl: string;
}
