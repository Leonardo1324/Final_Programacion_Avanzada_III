import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/Expense'; 

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  private apiUrl = 'http://localhost:3000/expenses';

constructor(private http: HttpClient) {}

getNextId() {
    return new Promise((resolve, reject) => {
      this.getExpenses().subscribe({
        next: (expenses) => {
          const maxId = expenses
            .map(a => parseInt(String(a.id), 10))
            .filter(id => !isNaN(id))
            .reduce((max, curr) => curr > max ? curr : max, 0);
          resolve((maxId + 1).toString());
        },
        error: (err) => reject(err)
      });
    });
  }
  
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }
  
  getExpense(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  createExpense(persona: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, persona);
  }

  updateExpense(persona: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${persona.id}`, persona);
  }
  
  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
}
