export default class LivreAudio {
  constructor({
    id,
    titre,
    auteur,
    description,
    couvertureUrl,
    duree,
    narrateur,
    nombreEcoutes,
  }) {
    this.id = id
    this.titre = titre
    this.auteur = auteur
    this.description = description
    this.couvertureUrl = couvertureUrl
    this.duree = duree
    this.narrateur = narrateur
    this.nombreEcoutes = nombreEcoutes
  }

  static fromApi(data) {
    return new LivreAudio({
      id: data.id,
      titre: data.titre,
      auteur: data.auteur,
      description: data.description,
      couvertureUrl: data.couvertureUrl,
      duree: data.duree,
      narrateur: data.narrateur,
      nombreEcoutes: data.nombreEcoutes,
    })
  }
}
