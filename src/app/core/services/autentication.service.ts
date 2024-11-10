import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { IUser } from '../../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {
  private urlAPI = "http://localhost:3000/utilizadores";
  private currentUser = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser.next(JSON.parse(storedUser));
      }
    }
  }

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
        if (user && isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser.next(user);
        }
        return user || null;
      })
    );
  }

  setCurrentUser(user: IUser | null) {
    if (isPlatformBrowser(this.platformId) && user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUser.next(user);
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentUser');
    }
    this.currentUser.next(null);
  }
}
