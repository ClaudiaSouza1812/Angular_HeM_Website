import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { IWishlist } from '../../models/IWishlist';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private urlAPI = "http://localhost:3000/wishlist";

  constructor(private http: HttpClient) { }

  private errorHandler(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.status === 404) {
      return throwError(() => 'Recurso não encontrado');
    } else {
      return throwError(() => `Ocorreu um erro! Status: ${error.status}, Message: ${error.message}`);
    }
  }

  getAllWishLists(): Observable<IWishlist[]> {
    return this.http.get<IWishlist[]>(this.urlAPI).pipe(
      map(wishlist => {
        console.log('Raw API Response:', wishlist);
        if (Array.isArray(wishlist)) {
          return wishlist;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  addToWishList(userId: number, productId: number,): Observable<IWishlist> {
    return this.getAllWishLists().pipe(
      map(wishlist => {
        const maxId = wishlist.length > 0 ? Math.max(...wishlist.map(item => item.id || 0)) : 0;
        const nextId = maxId + 1;

        const newWishList: IWishlist = {
          id: nextId,
          user_id: userId,
          product_id : productId,
          add_date: new Date().toISOString()
        };
        return newWishList;
      }),
      switchMap(wishlistItem => {
        return this.http.post<IWishlist>(this.urlAPI, wishlistItem);
      }),
      map(response => {
        console.log('Added to WishList: ', response);
        return response;
      }),
      catchError(this.errorHandler)
    );
  }

  removeFromWishList(wishlistId: number): Observable<any> {
    // Update to use the wishlist item's ID directly
    return this.http.delete(`${this.urlAPI}/${wishlistId}`).pipe(
      map(response => {
        console.log('Removed from wishlist:', response);
        return response;
      }),
      catchError(this.errorHandler)
    );
  }

  checkProductInWishList(userId: number, productId: number): Observable<boolean> {
    return this.getAllWishLists().pipe(
      map(wishlist => {
        return wishlist.some(item => 
          item.user_id === userId && item.product_id === productId
        );
      }),
      catchError(error => {
        console.error('Error checking wishlist:', error);
        return of(false);
      })
    );
  }

}
