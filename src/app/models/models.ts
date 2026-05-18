export interface Stock {
  id?: number;
  quantite: number;
  seuilAlerte: number;
  nomProduit?: string;
  nomEntrepot?: string;
}

export interface Entrepot {
  id?: number;
  nom: string;
  adresse: string;
  capacite: number;
  listeStock?: Stock[];
}

export interface Produit {
  id?: number;
  nom: string;
  categorie: string;
  prix: number;
  fournisseur: string;
  seuilMin: number;
}

export interface MouvementStock {
  id?: number;
  type: string;
  quantite: number;
  date?: string;
  nomProduit?: string;
  nomEntrepot?: string;
}