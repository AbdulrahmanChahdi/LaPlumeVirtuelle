export interface Livre {
  id: number;
  titre: string;
  auteur: Auteur;
  description: string;
  imageUrl: string;
  datePublication: string;
  categorie: Categorie;
  isbn: string;
  nombrePages: number;
  editeur: Editeur;
  langue: string;
  format: string;
  disponible: boolean;
}

export interface Auteur {
  id: number;
  nom: string;
  prenom: string;
}

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface Editeur {
  id: number;
  nom: string;
  pays: string;
}
