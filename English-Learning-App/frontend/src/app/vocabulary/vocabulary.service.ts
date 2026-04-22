import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VocabularyService{
    private apiUrl = 'http://127.0.0.1:8000/api/vocabulary';
    constructor(private http: HttpClient){
    }
    getWords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/words/`);
    }
    
    addWord(word: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/words/`, word);
  }

  deleteWord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/words/${id}/`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/`);
  }
  updateWord(id: number, word: any) {
    return this.http.put(`${this.apiUrl}/${id}/`, word);
}
}