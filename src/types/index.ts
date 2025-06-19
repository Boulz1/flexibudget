// Définit les trois piliers possibles pour une catégorie de dépense
export type Pillar = 'Besoins' | 'Envies' | 'Épargne';

// Définit la structure d'une transaction
export interface Transaction {
  id: string;
  type: 'revenu' | 'depense';
  amount: number;
  date: string; // Pour la simplicité, on utilise une string (ex: "2024-06-15")
  description: string;
  pillar?: Pillar; // Le pilier est optionnel, car un revenu n'en a pas
}

// Définit la structure d'une catégorie de dépense
export interface Category {
  id: string;
  name: string;
  type: 'revenu' | 'depense';
  pillar?: Pillar; // Le pilier devient optionnel
}


export interface Transaction {
  id: string;
  type: 'revenu' | 'depense';
  amount: number;
  date: string;
  description: string;
  categoryId?: string; // <-- MODIFIÉ : On stocke l'ID de la catégorie
  pillar?: Pillar; // On garde pillar optionnel, mais il sera ajouté par le store
}