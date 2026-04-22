import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { email, password });
  }

  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { email, username, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/`, { email });
  }

  
  verifyCode(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code/`, { 
      email: email, 
      code: code, 
      new_password: newPassword 
    });
  }
}