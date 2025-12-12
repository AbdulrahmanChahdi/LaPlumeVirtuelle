export default class Podcast {
  constructor({
    id,
    titre,
    description,
    animateur,
    couvertureUrl,
    duree,
    nombreTelechargements,
  }) {
    this.id = id
    this.titre = titre
    this.description = description
    this.animateur = animateur
    this.couvertureUrl = couvertureUrl
    this.duree = duree
    this.nombreTelechargements = nombreTelechargements
  }

  static fromApi(data) {
    return new Podcast({
      id: data.id,
      titre: data.titre,
      description: data.description,
      animateur: data.animateur,
      couvertureUrl: data.couvertureUrl,
      duree: data.duree,
      nombreTelechargements: data.nombreTelechargements,
    })
  }
}
