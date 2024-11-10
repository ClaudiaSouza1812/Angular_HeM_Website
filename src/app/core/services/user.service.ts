import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { IUser } from '../../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlAPI = "http://localhost:3000/utilizadores";

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
      map(user => {
        console.log('Raw API Response:', user);
        if (Array.isArray(user)) {
          return user;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  insertUser(user: IUser) {
    return this.http.post<IUser>(this.urlAPI, user)
    .pipe(
      tap(user => console.log(user)),concatMap(newUser => this.http.get<IUser[]>(this.urlAPI)));
  }

  searchUsers(searchValue: string) {
    return this.http.get<IUser[]>(`${this.urlAPI}?title_like=${searchValue}`).pipe(catchError(this.errorHandler));
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`)
    .pipe(
      tap(user => console.log(user)),concatMap(result => this.http.get<IUser[]>(this.urlAPI)),catchError(this.errorHandler));
  }

  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.urlAPI}/${id}`)
    .pipe(
      tap(user => console.log(user)),catchError(this.errorHandler));
  }

}
