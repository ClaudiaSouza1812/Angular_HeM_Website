import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Http2ServerResponse } from 'http2';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { threadId } from 'worker_threads';
import { IUser } from '../../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  private urlAPI = "http://localhost:3001/utilizadores";

  private currentUser = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) { }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => error.message)
    } else {
      return throwError(() => "Ocorreu um erro!")
    }
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.urlAPI).pipe(
      map(users => {
        console.log('Raw API Response: ', users);
        if (Array.isArray(users)) {
          return users;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getUser(email: string, password: string): Observable<IUser | null> {
    return this.getAllUsers().pipe(
      map(users => {
        const user = users.find(u => 
          u.email === email && u.senha === password
        );
        if (user) {
          this.setCurrentUser(user); // Automatically set user when found
        }
        return user || null;
      })
    );
  }

  setCurrentUser(user: IUser | null) {
    this.currentUser.next(user);
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  logout() {
    this.currentUser.next(null);
  }
}
