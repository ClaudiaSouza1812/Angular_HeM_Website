// Import necessary modules:
// - HttpClient/HttpErrorResponse for making HTTP requests and handling errors
// - Injectable/PLATFORM_ID/Inject for dependency injection and platform detection
// - isPlatformBrowser to check if code runs in browser environment
// - RxJS utilities for reactive programming
// - IUser interface that defines our user data structure
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { IUser } from '../../models/IUser';

// Injectable decorator makes this service available for dependency injection
// providedIn: 'root' means it's a singleton service available throughout the app
@Injectable({
  providedIn: 'root'
})
export class AutenticationService {
  // The base URL that points to our API endpoints for user data
  // This private property keeps our API URL encapsulated within the service
  private urlAPI = "http://localhost:3000/utilizadores";

  // The "source of truth" for our current user's state
  // Private BehaviorSubject that can both emit and receive values
  // Initialized as null since no user is logged in when the app starts
  private currentUser = new BehaviorSubject<IUser | null>(null);

  // the observable that will update all subscribers about this modal visibility
  // Public Observable - is a public Observable that components can subscribe to (the $ suffix is a convention for Observables)
  // This pattern follows the principle of encapsulation - components can observe the state but can't directly modify it so only the service can modify its value using .next()
  public currentUser$ = this.currentUser.asObservable();

  // Inject HttpClient to enable making HTTP requests to our backend
  // This private property lets us communicate with our API endpoints
  // Inject PLATFORM_ID to detect whether we're running in browser or server environment
  // This helps us handle platform-specific operations safely
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { 
    // Only try to restore the user session if we're running in a browser
    // This prevents errors when running server-side where sessionStorage isn't available
    if (isPlatformBrowser(this.platformId)) {
      // Check if we have a stored user in the browser's session storage
      // This helps maintain user state across page refreshes
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        // If we found a stored user, parse the JSON and update our BehaviorSubject
        // This restores the user's session when they return to our app
        this.currentUser.next(JSON.parse(storedUser));
      }
    }
  }

  // Handles errors that occur during HTTP requests
  // Returns an appropriate error message based on the type of error encountered
  errorHandler(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => error.message)
    } else {
      return throwError(() => "Ocorreu um erro!")
    }
  }

  // Fetches the complete list of users from our API
 // Returns an Observable of IUser array that we can subscribe to for updates
  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.urlAPI).pipe(
      // Transform and validate the data we receive from the API
     // This ensures we're working with the correct data format
      map(users => {
        console.log('Raw API Response: ', users);
        if (Array.isArray(users)) {
          return users;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      // Handle any errors using our custom error handler
     // This provides consistent error handling across our application
      catchError(this.errorHandler)
    );
  }

  // Authenticates a user using their email and password
 // Returns an Observable that will emit either the found user or null
  getUser(email: string, password: string): Observable<IUser | null> {
    return this.getAllUsers().pipe(
      map(users => {
        // Search through our users to find one matching the provided credentials
       // This performs the actual authentication check
        const user = users.find(u => 
          u.email === email && u.senha === password
        );
        // If we found a matching user and we're in a browser environment
       // Update both session storage and our BehaviorSubject
        if (user && isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser.next(user);
        }
        return user || null;
      })
    );
  }

  // Updates the current user state in our application
 // Handles both the BehaviorSubject update and session storage persistence
  setCurrentUser(user: IUser | null) {
    if (isPlatformBrowser(this.platformId) && user) {
      // If we're in a browser and have a user, persist them to session storage
     // This maintains the user's session across page refreshes
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    // Update our BehaviorSubject with the new user state
   // This notifies all subscribers about the change
    this.currentUser.next(user);
  }

  // Checks if we currently have a logged-in user
 // Returns true if we have a user, false if we don't
  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  // Logs out the current user by clearing both storage and state
 // This ensures a complete logout across all parts of our application
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      // Clear the user data from session storage if we're in a browser
     // This prevents the session from persisting after logout
      sessionStorage.removeItem('currentUser');
    }
    // Reset our BehaviorSubject to null, indicating no current user
   // This notifies all subscribers that the user has logged out
    this.currentUser.next(null);
  }
}
