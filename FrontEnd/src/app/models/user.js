export default class User {
  constructor({
    id,
    email,
    prenom,
    nom,
    role,
  }) {
    this.id = id
    this.email = email
    this.prenom = prenom
    this.nom = nom
    this.role = role
  }

  static fromApi(data) {
    return new User({
      id: data.id,
      email: data.email,
      prenom: data.prenom,
      nom: data.nom,
      role: data.role,
    })
  }

  get fullName() {
    return `${this.prenom} ${this.nom}`
  }

  isAdmin() {
    return this.role === "ADMIN"
  }
}
