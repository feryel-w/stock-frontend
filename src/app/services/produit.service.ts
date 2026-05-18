import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProduitService {

  private url = 'http://localhost:8080/produits';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.url);
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.url}/${id}`);
  }

  getByCategorie(categorie: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.url}/categorie/${categorie}`);
  }

  getByFournisseur(fournisseur: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.url}/fournisseur/${fournisseur}`);
  }

  create(p: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.url, p);
  }

  update(id: number, p: Produit): Observable<string> {
    return this.http.put<string>(`${this.url}/${id}`, p, { responseType: 'text' as 'json' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}