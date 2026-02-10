"""
Base de données d'entraînement pour le système NLP
Contient les livres, audiobooks et podcasts avec leurs métadonnées
"""

TRAINING_BOOKS = [
    {
        "id": "L001",
        "type": "livre",
        "titre": "Fondation",
        "auteur": "Isaac Asimov",
        "genre": "Science-Fiction",
        "description": "Une série épique explorant l'effondrement d'un empire galactique et sa reconstruction à travers la psychohistoire",
        "thematiques": ["science", "futur", "politique", "mathématiques"],
        "mots_cles": ["empire", "galaxie", "prédiction", "psychologie", "civilisation"],
        "duree_heures": 30,
        "niveau_lecture": "avance"
    },
    {
        "id": "L002",
        "type": "livre",
        "titre": "1984",
        "auteur": "George Orwell",
        "genre": "Science-Fiction",
        "description": "Un roman dystopique sombre sur la surveillance totalitaire et la manipulation de la vérité",
        "thematiques": ["politique", "surveillance", "liberté"],
        "mots_cles": ["dystopie", "big brother", "contrôle", "manipulation", "totalitarisme"],
        "duree_heures": 15,
        "niveau_lecture": "avance"
    },
    {
        "id": "L003",
        "type": "livre",
        "titre": "Dune",
        "auteur": "Frank Herbert",
        "genre": "Science-Fiction",
        "description": "Une saga complexe sur les planètes désertiques, la politique intergalactique et l'écologie",
        "thematiques": ["écologie", "politique", "religion", "futur"],
        "mots_cles": ["désert", "épice", "empire", "prophétie", "survie"],
        "duree_heures": 22,
        "niveau_lecture": "avance"
    },
    {
        "id": "L004",
        "type": "livre",
        "titre": "Le Seigneur des Anneaux",
        "auteur": "J.R.R. Tolkien",
        "genre": "Fantasy",
        "description": "Une épopée fantasy avec elfes, nains, hobbits dans une quête pour détruire un anneau maléfique",
        "thematiques": ["aventure", "magie", "bien vs mal"],
        "mots_cles": ["fantasy", "dragons", "magie", "quête", "héros"],
        "duree_heures": 25,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "L005",
        "type": "livre",
        "titre": "Orgueil et Préjugés",
        "auteur": "Jane Austen",
        "genre": "Romance",
        "description": "Un classique de la romance sur les relations sociales et l'amour dans l'Angleterre du 19e siècle",
        "thematiques": ["romance", "société", "mariage"],
        "mots_cles": ["amour", "mariage", "société", "classe sociale", "fierté"],
        "duree_heures": 12,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "L006",
        "type": "livre",
        "titre": "Neuromancien",
        "auteur": "William Gibson",
        "genre": "Cyberpunk",
        "description": "Le roman fondateur du cyberpunk avec hackers, intelligence artificielle et réalité virtuelle",
        "thematiques": ["technologie", "futur", "hacking"],
        "mots_cles": ["cyberpunk", "IA", "hacker", "virtuel", "dystopie"],
        "duree_heures": 10,
        "niveau_lecture": "avance"
    },
    {
        "id": "L007",
        "type": "livre",
        "titre": "Les Misérables",
        "auteur": "Victor Hugo",
        "genre": "Historique",
        "description": "Un roman historique épique sur la justice, la rédemption et la révolution française",
        "thematiques": ["histoire", "justice", "société"],
        "mots_cles": ["révolution", "justice", "pauvreté", "rédemption", "France"],
        "duree_heures": 45,
        "niveau_lecture": "avance"
    },
    {
        "id": "L008",
        "type": "livre",
        "titre": "Le Code Da Vinci",
        "auteur": "Dan Brown",
        "genre": "Thriller",
        "description": "Un thriller mystérieux mêlant art, religion et codes secrets",
        "thematiques": ["mystère", "histoire", "religion"],
        "mots_cles": ["mystère", "codes", "art", "secrets", "enquête"],
        "duree_heures": 17,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "L009",
        "type": "livre",
        "titre": "Harry Potter",
        "auteur": "J.K. Rowling",
        "genre": "Fantasy",
        "description": "Une série fantasy suivant un jeune sorcier dans un monde magique",
        "thematiques": ["magie", "aventure", "amitié"],
        "mots_cles": ["magie", "sorcier", "école", "aventure", "fantasy"],
        "duree_heures": 140,
        "niveau_lecture": "debutant"
    },
    {
        "id": "L010",
        "type": "livre",
        "titre": "La jeune fille à la perle",
        "auteur": "Tracy Chevalier",
        "genre": "Historique",
        "description": "Roman historique sur l'art et la vie au 17e siècle aux Pays-Bas",
        "thematiques": ["art", "histoire", "romance"],
        "mots_cles": ["peinture", "art", "histoire", "romance", "Vermeer"],
        "duree_heures": 8,
        "niveau_lecture": "intermediaire"
    }
]

TRAINING_AUDIOBOOKS = [
    {
        "id": "A001",
        "type": "livreAudio",
        "titre": "Sapiens",
        "auteur": "Yuval Noah Harari",
        "genre": "Sciences Humaines",
        "description": "Une brève histoire de l'humanité explorant l'évolution de notre espèce",
        "thematiques": ["histoire", "science", "évolution"],
        "mots_cles": ["humanité", "évolution", "société", "histoire", "anthropologie"],
        "duree_heures": 15,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "A002",
        "type": "livreAudio",
        "titre": "L'Alchimiste",
        "auteur": "Paulo Coelho",
        "genre": "Fiction",
        "description": "Un conte philosophique sur la quête de soi et la réalisation des rêves",
        "thematiques": ["philosophie", "voyage", "spiritualité"],
        "mots_cles": ["quête", "rêves", "destin", "voyage", "spiritualité"],
        "duree_heures": 4,
        "niveau_lecture": "debutant"
    },
    {
        "id": "A003",
        "type": "livreAudio",
        "titre": "Ready Player One",
        "auteur": "Ernest Cline",
        "genre": "Science-Fiction",
        "description": "Une aventure cyberpunk dans un monde virtuel dystopique",
        "thematiques": ["jeux vidéo", "réalité virtuelle", "futur"],
        "mots_cles": ["gaming", "virtuel", "quête", "technologie", "dystopie"],
        "duree_heures": 16,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "A004",
        "type": "livreAudio",
        "titre": "Le Petit Prince",
        "auteur": "Antoine de Saint-Exupéry",
        "genre": "Fiction",
        "description": "Un conte poétique sur l'enfance, l'amour et le sens de la vie",
        "thematiques": ["philosophie", "enfance", "amitié"],
        "mots_cles": ["enfant", "planète", "rose", "amitié", "poésie"],
        "duree_heures": 2,
        "niveau_lecture": "debutant"
    },
    {
        "id": "A005",
        "type": "livreAudio",
        "titre": "Le Hobbit",
        "auteur": "J.R.R. Tolkien",
        "genre": "Fantasy",
        "description": "Une aventure fantasy suivant un hobbit dans une quête extraordinaire",
        "thematiques": ["aventure", "fantasy", "dragons"],
        "mots_cles": ["hobbit", "dragon", "trésor", "aventure", "magie"],
        "duree_heures": 11,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "A006",
        "type": "livreAudio",
        "titre": "L'Étranger",
        "auteur": "Albert Camus",
        "genre": "Fiction",
        "description": "Un roman philosophique sur l'absurde et l'existence",
        "thematiques": ["philosophie", "existentialisme", "absurde"],
        "mots_cles": ["absurde", "existence", "société", "philosophie", "indifférence"],
        "duree_heures": 4,
        "niveau_lecture": "avance"
    },
    {
        "id": "A007",
        "type": "livreAudio",
        "titre": "Steve Jobs",
        "auteur": "Walter Isaacson",
        "genre": "Biographie",
        "description": "La biographie autorisée de Steve Jobs, cofondateur d'Apple",
        "thematiques": ["technologie", "innovation", "entrepreneuriat"],
        "mots_cles": ["Apple", "technologie", "innovation", "business", "design"],
        "duree_heures": 24,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "A008",
        "type": "livreAudio",
        "titre": "Devenir",
        "auteur": "Michelle Obama",
        "genre": "Biographie",
        "description": "Les mémoires inspirantes de l'ancienne Première Dame des États-Unis",
        "thematiques": ["inspiration", "politique", "société"],
        "mots_cles": ["inspiration", "femmes", "leadership", "politique", "USA"],
        "duree_heures": 19,
        "niveau_lecture": "intermediaire"
    }
]

TRAINING_PODCASTS = [
    {
        "id": "P001",
        "type": "podcast",
        "titre": "Science Expliquée",
        "animateur": "Dr. Jean Michel",
        "genre": "Éducatif",
        "description": "Des épisodes éducatifs expliquant des concepts scientifiques complexes simplement",
        "thematiques": ["science", "éducation", "vulgarisation"],
        "mots_cles": ["science", "physique", "chimie", "biologie", "apprentissage"],
        "duree_minutes": 35,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "P002",
        "type": "podcast",
        "titre": "Histoires Mystérieuses",
        "animateur": "Marie Dupont",
        "genre": "Mystère",
        "description": "Des histoires fascinantes sur le paranormal et les énigmes non résolues",
        "thematiques": ["mystère", "paranormal", "énigmes"],
        "mots_cles": ["mystère", "paranormal", "enquête", "inexpliqué", "suspense"],
        "duree_minutes": 45,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "P003",
        "type": "podcast",
        "titre": "Interviews Créatives",
        "animateur": "Sophie Lefèvre",
        "genre": "Entretien",
        "description": "Des interviews inspirantes avec des créatifs et entrepreneurs",
        "thematiques": ["créativité", "entrepreneuriat", "inspiration"],
        "mots_cles": ["créativité", "artistes", "entrepreneurs", "inspiration", "innovation"],
        "duree_minutes": 60,
        "niveau_lecture": "debutant"
    },
    {
        "id": "P004",
        "type": "podcast",
        "titre": "Voyage dans le Temps",
        "animateur": "Pierre Arnaud",
        "genre": "Histoire",
        "description": "Un voyage à travers les événements historiques majeurs",
        "thematiques": ["histoire", "culture", "société"],
        "mots_cles": ["histoire", "événements", "civilisation", "culture", "passé"],
        "duree_minutes": 50,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "P005",
        "type": "podcast",
        "titre": "Thriller Sonore",
        "animateur": "Collectif Audio",
        "genre": "Thriller",
        "description": "Des drames audio captivants avec suspense et intrigues",
        "thematiques": ["suspense", "fiction", "drame"],
        "mots_cles": ["suspense", "thriller", "intrigue", "mystère", "fiction"],
        "duree_minutes": 55,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "P006",
        "type": "podcast",
        "titre": "Tech Talk",
        "animateur": "Alex Martin",
        "genre": "Technologie",
        "description": "Discussions sur les dernières innovations technologiques",
        "thematiques": ["technologie", "innovation", "futur"],
        "mots_cles": ["tech", "innovation", "IA", "gadgets", "startups"],
        "duree_minutes": 40,
        "niveau_lecture": "intermediaire"
    },
    {
        "id": "P007",
        "type": "podcast",
        "titre": "Méditation Guidée",
        "animateur": "Zen Master",
        "genre": "Bien-être",
        "description": "Sessions de méditation et relaxation pour réduire le stress",
        "thematiques": ["bien-être", "méditation", "relaxation"],
        "mots_cles": ["méditation", "relaxation", "zen", "stress", "mindfulness"],
        "duree_minutes": 20,
        "niveau_lecture": "debutant"
    },
    {
        "id": "P008",
        "type": "podcast",
        "titre": "Cuisine du Monde",
        "animateur": "Chef Antoine",
        "genre": "Gastronomie",
        "description": "Découverte des cuisines et recettes du monde entier",
        "thematiques": ["cuisine", "culture", "voyage"],
        "mots_cles": ["cuisine", "recettes", "gastronomie", "culture", "saveurs"],
        "duree_minutes": 30,
        "niveau_lecture": "debutant"
    }
]

def get_all_training_data():
    """Retourne toutes les données d'entraînement"""
    return TRAINING_BOOKS + TRAINING_AUDIOBOOKS + TRAINING_PODCASTS

def get_training_data_by_type(content_type):
    """Retourne les données filtrées par type"""
    if content_type == "livre":
        return TRAINING_BOOKS
    elif content_type == "livreAudio":
        return TRAINING_AUDIOBOOKS
    elif content_type == "podcast":
        return TRAINING_PODCASTS
    else:
        return get_all_training_data()
