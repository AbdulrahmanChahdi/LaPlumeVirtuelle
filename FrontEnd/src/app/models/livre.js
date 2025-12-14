export default class Livre {
  constructor({
    id,
    titre,
    auteur,
    description,
    couvertureUrl,
    datePublication,
    categorie,
    nombreLectures,
  }) {
    this.id = id
    this.titre = titre
    this.auteur = auteur
    this.description = description
    this.couvertureUrl = couvertureUrl
    this.datePublication = datePublication
    this.categorie = categorie
    this.nombreLectures = nombreLectures
  }

  static fromApi(data) {
    return new Livre({
      id: data.id,
      titre: data.titre,
      auteur: data.auteur,
      description: data.description,
      couvertureUrl: data.couvertureUrl,
      datePublication: data.datePublication,
      categorie: data.categorie,
      nombreLectures: data.nombreLectures,
    })
  }
}
