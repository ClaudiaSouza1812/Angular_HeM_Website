import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { IUser } from '../../models/IUser';

// Decorator to make this service injectable and available application-wide
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Base URL for the API endpoint handling user operations
  private urlAPI = "http://localhost:3000/utilizadores";

  // Inject HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  // Error handling method to provide consistent error responses
  errorHandler(error: HttpErrorResponse) {
    // If resource is not found (404 error), return the specific error message
    if (error.status === 404) {
      return throwError(() => error.message)
    } else {
      // For other errors, return a generic error message
      return throwError(() => "Ocorreu um erro!")
    }
  }

  // Retrieve all users from the API
  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.urlAPI).pipe(
      // Transform and validate the API response
      map(user => {
        // Log the raw API response for debugging
        console.log('Raw API Response:', user);
        
        // Ensure the response is an array
        if (Array.isArray(user)) {
          return user;
        } else {
          // Throw an error if the response is not an array
          throw new Error('Invalid API response format');
        }
      }),
      // Catch and handle any errors during the request
      catchError(this.errorHandler)
    );
  }

  // Insert a new user into the system
  insertUser(user: IUser) {
    // Automatically set the addition date to current timestamp
    user.add_date = new Date().toISOString();
    // Set the new user as inactive by default
    user.active = false;

    return this.http.post<IUser>(this.urlAPI, user)
    .pipe(
      // Log the newly created user
      tap(user => console.log(user)),
      // After successful insertion, fetch the updated list of users
      concatMap(newUser => this.http.get<IUser[]>(this.urlAPI))
    );
  }

  // Search users based on a search value (likely searching by title)
  searchUsers(searchValue: string) {
    // Use query parameter to filter users 
    return this.http.get<IUser[]>(`${this.urlAPI}?title_like=${searchValue}`)
      .pipe(catchError(this.errorHandler));
  }

  // Check if an email already exists in the system
  checkIfEmailExists(email: string): Observable<boolean> {
    return this.http.get<IUser[]>(this.urlAPI).pipe(
      // Map the users array to check if any user has the given email
      map(users => users.some(user => user.email.toLowerCase() === email.toLowerCase())),
      // Handle any potential errors
      catchError(this.errorHandler)
    );
  }

  // Delete a user by their ID
  deleteUser(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`)
    .pipe(
      // Log the deletion result
      tap(user => console.log(user)),
      // After deletion, fetch the updated list of users
      concatMap(result => this.http.get<IUser[]>(this.urlAPI)),
      // Catch and handle any errors
      catchError(this.errorHandler)
    );
  }

  // Retrieve a single user by their ID
  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.urlAPI}/${id}`)
    .pipe(
      // Log the retrieved user
      tap(user => console.log(user)),
      // Catch and handle any errors
      catchError(this.errorHandler)
    );
  }
}
