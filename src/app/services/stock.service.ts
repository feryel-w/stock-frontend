import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, MouvementStock } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StockService {

  private url = 'http://localhost:8080/stocks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.url);
  }

  getById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.url}/${id}`);
  }

  getByEntrepot(id: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.url}/entrepot/${id}`);
  }

  getAlertes(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.url}/alertes`);
  }

  create(produitId: number, entrepotId: number, s: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.url}/produit/${produitId}/entrepot/${entrepotId}`, s);
  }

  update(id: number, s: Stock): Observable<string> {
    return this.http.put<string>(`${this.url}/${id}`, s, { responseType: 'text' as 'json' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}

@Injectable({ providedIn: 'root' })
export class MouvementService {

  private url = 'http://localhost:8080/mouvements';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(this.url);
  }

  getByEntrepot(id: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.url}/entrepot/${id}`);
  }

  getByProduit(id: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.url}/produit/${id}`);
  }

  create(produitId: number, entrepotId: number, type: string, quantite: number): Observable<MouvementStock> {
    return this.http.post<MouvementStock>(
      `${this.url}?produitId=${produitId}&entrepotId=${entrepotId}&type=${type}&quantite=${quantite}`, {}
    );
  }

}