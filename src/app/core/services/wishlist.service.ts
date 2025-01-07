import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { IWishlist } from '../../models/IWishlist';

// Decorator to make this service injectable and available application-wide
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  // Base URL for the API endpoint handling wishlist operations
  private urlAPI = "http://localhost:3000/wishlist";

  // Inject HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  // Centralized error handling method for consistent error responses
  private errorHandler(error: HttpErrorResponse) {
    // Log the full error details for debugging
    console.error('API Error:', error);

    // Handle specific 404 (Not Found) error with a custom message
    if (error.status === 404) {
      return throwError(() => 'Recurso não encontrado');
    } else {
      // For other errors, return a detailed error message including status and message
      return throwError(() => `Ocorreu um erro! Status: ${error.status}, Message: ${error.message}`);
    }
  }

  // Retrieve all wishlist items from the API
  getAllWishLists(): Observable<IWishlist[]> {
    return this.http.get<IWishlist[]>(this.urlAPI).pipe(
      // Transform and validate the API response
      map(wishlist => {
        // Log the raw API response for debugging
        console.log('Raw API Response:', wishlist);
        
        // Ensure the response is an array
        if (Array.isArray(wishlist)) {
          return wishlist;
        } else {
          // Throw an error if the response is not an array
          throw new Error('Invalid API response format');
        }
      }),
      // Catch and handle any errors during the request
      catchError(this.errorHandler)
    );
  }

  // Add a product to the user's wishlist
  addToWishList(userId: number, productId: number,): Observable<IWishlist> {
    return this.getAllWishLists().pipe(
      // Generate a new wishlist item with a unique ID
      map(wishlist => {
        // Find the maximum existing ID to generate a new unique ID
        const maxId = wishlist.length > 0 ? Math.max(...wishlist.map(item => item.id || 0)) : 0;
        const nextId = maxId + 1;

        // Create a new wishlist item object
        const newWishList: IWishlist = {
          id: nextId,
          user_id: userId,
          product_id : productId,
          add_date: new Date().toISOString() // Timestamp for when item was added
        };
        return newWishList;
      }),
      // Send the new wishlist item to the API
      switchMap(wishlistItem => {
        return this.http.post<IWishlist>(this.urlAPI, wishlistItem);
      }),
      // Log the added wishlist item
      map(response => {
        console.log('Added to WishList: ', response);
        return response;
      }),
      // Catch and handle any errors during the process
      catchError(this.errorHandler)
    );
  }

  // Remove a specific item from the wishlist by its ID
  removeFromWishList(wishlistId: number): Observable<any> {
    return this.http.delete(`${this.urlAPI}/${wishlistId}`).pipe(
      // Log the removal response
      map(response => {
        console.log('Removed from wishlist:', response);
        return response;
      }),
      // Catch and handle any errors during the removal
      catchError(this.errorHandler)
    );
  }

  // Check if a specific product is already in a user's wishlist
  checkProductInWishList(userId: number, productId: number): Observable<boolean> {
    return this.getAllWishLists().pipe(
      // Find if any wishlist item matches the user and product
      map(wishlist => {
        return wishlist.some(item => 
          item.user_id === userId && item.product_id === productId
        );
      }),
      // Catch any errors, logging them and returning false
      catchError(error => {
        console.error('Error checking wishlist:', error);
        return of(false); // Return false if there's an error checking the wishlist
      })
    );
  }
}