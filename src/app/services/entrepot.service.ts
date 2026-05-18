import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrepot } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EntrepotService {

  private url = 'http://localhost:8080/entrepots';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Entrepot[]> {
    return this.http.get<Entrepot[]>(this.url);
  }

  getById(id: number): Observable<Entrepot> {
    return this.http.get<Entrepot>(`${this.url}/${id}`);
  }

  create(e: Entrepot): Observable<Entrepot> {
    return this.http.post<Entrepot>(this.url, e);
  }

  update(id: number, e: Entrepot): Observable<string> {
    return this.http.put<string>(`${this.url}/${id}`, e, { responseType: 'text' as 'json' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}