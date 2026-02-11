/**
 * Mapping des catégories Google Books vers les thématiques locales
 * Basé sur les 67 thématiques du dataset de recommandations
 */

// Nos thématiques locales cohérentes
export const LOCAL_CATEGORIES = [
  "science",
  "fantasy",
  "romance",
  "thriller",
  "dystopie",
  "cyberpunk",
  "art",
  "astronomie",
  "biographie",
  "business",
  "classique",
  "comedie",
  "contemporain",
  "cuisine",
  "drame",
  "economie",
  "education",
  "environnement",
  "espionnage",
  "essai",
  "fantastique",
  "geographie",
  "horreur",
  "histoire",
  "historique",
  "humour",
  "informatique",
  "jeunesse",
  "litterature",
  "management",
  "mathematiques",
  "medecine",
  "memoires",
  "mystere",
  "mythologie",
  "nature",
  "philosophie",
  "photographie",
  "physique",
  "poesie",
  "polar",
  "politique",
  "psychologie",
  "religion",
  "robotique",
  "roman",
  "sante",
  "science-fiction",
  "sociologie",
  "sport",
  "spiritualite",
  "steampunk",
  "suspense",
  "technologie",
  "theatre",
  "voyage",
  "aventure",
  "action",
  "jeune-adulte",
  "paranormal",
  "urban-fantasy",
  "space-opera",
  "western",
  "post-apocalyptique",
  "utopie",
  "enquete",
  "guerre",
  "developpement-personnel"
];

// Mapping Google Books categories -> Local categories
const CATEGORY_MAPPING = {
  // Fiction
  "Fiction": "roman",
  "Literary Fiction": "litterature",
  "General Fiction": "roman",
  "Contemporary Fiction": "contemporain",
  "Classic Literature": "classique",
  
  // Science & Tech
  "Science": "science",
  "Technology": "technologie",
  "Computers": "informatique",
  "Mathematics": "mathematiques",
  "Physics": "physique",
  "Astronomy": "astronomie",
  "Computer Science": "informatique",
  "Programming": "informatique",
  "Robotics": "robotique",
  "Engineering": "technologie",
  
  // Fantasy & SF
  "Fantasy": "fantasy",
  "Science Fiction": "science-fiction",
  "Dystopian": "dystopie",
  "Cyberpunk": "cyberpunk",
  "Steampunk": "steampunk",
  "Urban Fantasy": "urban-fantasy",
  "Paranormal": "paranormal",
  "Space Opera": "space-opera",
  "Post-Apocalyptic": "post-apocalyptique",
  "Utopian": "utopie",
  
  // Mystery & Thriller
  "Mystery": "mystere",
  "Thriller": "thriller",
  "Suspense": "suspense",
  "Crime": "polar",
  "Detective": "enquete",
  "Spy": "espionnage",
  "Mystery & Thrillers": "thriller",
  "Police Procedural": "polar",
  
  // Romance
  "Romance": "romance",
  "Contemporary Romance": "romance",
  "Historical Romance": "romance",
  "Paranormal Romance": "paranormal",
  
  // Adventure & Action
  "Adventure": "aventure",
  "Action": "action",
  "War": "guerre",
  "Western": "western",
  "Action & Adventure": "aventure",
  
  // History & Biography
  "History": "histoire",
  "Historical": "historique",
  "Biography": "biographie",
  "Autobiography": "memoires",
  "Memoirs": "memoires",
  "Biography & Autobiography": "biographie",
  
  // Philosophy & Religion
  "Philosophy": "philosophie",
  "Religion": "religion",
  "Spirituality": "spiritualite",
  "Mythology": "mythologie",
  
  // Social Sciences
  "Psychology": "psychologie",
  "Sociology": "sociologie",
  "Politics": "politique",
  "Economics": "economie",
  "Business": "business",
  "Management": "management",
  "Political Science": "politique",
  "Social Science": "sociologie",
  
  // Self-help & Health
  "Self-Help": "developpement-personnel",
  "Health": "sante",
  "Medicine": "medecine",
  "Medical": "medecine",
  "Body, Mind & Spirit": "developpement-personnel",
  
  // Arts
  "Art": "art",
  "Photography": "photographie",
  "Music": "art",
  "Drama": "theatre",
  "Performing Arts": "theatre",
  "Theater": "theatre",
  
  // Nature & Geography
  "Nature": "nature",
  "Geography": "geographie",
  "Travel": "voyage",
  "Environment": "environnement",
  "Environmental Science": "environnement",
  
  // Humor & Poetry
  "Humor": "humour",
  "Comedy": "comedie",
  "Poetry": "poesie",
  
  // Horror
  "Horror": "horreur",
  
  // Education & Essays
  "Education": "education",
  "Essays": "essai",
  "Literary Essays": "essai",
  
  // Young Adult
  "Young Adult": "jeune-adulte",
  "Juvenile Fiction": "jeunesse",
  "Children": "jeunesse",
  
  // Food
  "Cooking": "cuisine",
  "Food": "cuisine",
  
  // Sports
  "Sports": "sport",
  "Sports & Recreation": "sport"
};

/**
 * Normalise une catégorie Google Books vers une thématique locale
 * @param {string} googleCategory - Catégorie de Google Books
 * @returns {string} - Thématique locale normalisée
 */
export function normalizeCategory(googleCategory) {
  if (!googleCategory) return null;
  
  // Nettoyer la catégorie
  const cleaned = googleCategory.trim();
  
  // Recherche exacte
  if (CATEGORY_MAPPING[cleaned]) {
    return CATEGORY_MAPPING[cleaned];
  }
  
  // Recherche partielle (si la catégorie Google contient un mot-clé)
  const lowerCleaned = cleaned.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (lowerCleaned.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCleaned)) {
      return value;
    }
  }
  
  // Recherche dans les catégories locales directement
  const directMatch = LOCAL_CATEGORIES.find(cat => 
    lowerCleaned.includes(cat) || cat.includes(lowerCleaned)
  );
  if (directMatch) return directMatch;
  
  // Par défaut, retourner "roman" pour Fiction générique
  return "roman";
}

/**
 * Extrait et normalise les catégories d'un livre Google Books
 * @param {Object} book - Livre de Google Books
 * @returns {string[]} - Liste des thématiques normalisées
 */
export function extractCategories(book) {
  const categories = new Set();
  
  // Catégories du champ 'categories'
  if (book.categories && Array.isArray(book.categories)) {
    book.categories.forEach(cat => {
      const normalized = normalizeCategory(cat);
      if (normalized) categories.add(normalized);
    });
  }
  
  // Catégorie du champ 'categorie' (si présent)
  if (book.categorie) {
    const normalized = normalizeCategory(book.categorie);
    if (normalized) categories.add(normalized);
  }
  
  // Si aucune catégorie trouvée, utiliser "roman" par défaut
  if (categories.size === 0) {
    categories.add("roman");
  }
  
  return Array.from(categories);
}

/**
 * Enrichit un livre avec ses catégories normalisées
 * @param {Object} book - Livre de Google Books
 * @returns {Object} - Livre enrichi avec normalizedCategories
 */
export function enrichBookWithCategories(book) {
  return {
    ...book,
    normalizedCategories: extractCategories(book)
  };
}
