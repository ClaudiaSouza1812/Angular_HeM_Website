import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ICart } from '../../models/ICart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private urlAPI = "http://localhost:3000/cart";
  constructor(private http: HttpClient) { }

  private errorHandler(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.status === 404) {
      return throwError(() => 'Recurso não encontrado');
    } else {
      return throwError(() => `Ocorreu um erro! Status: ${error.status}, Message: ${error.message}`);
    }
  }

  getAllCarts(): Observable<ICart[]> {
    return this.http.get<ICart[]>(this.urlAPI).pipe(
      map(cart => {
        console.log('Raw API Response:', cart);
        if (Array.isArray(cart)) {
          return cart;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  addToCart(userId: number, productId: number,): Observable<ICart> {
    return this.getAllCarts().pipe(
      map(cart => {
        console.log('Current cart items:', cart); // Log existing cart items
        const maxId = cart.length > 0 ? Math.max(...cart.map(item => item.id || 0)) : 0;
        const nextId = maxId + 1;
  
        const newCart: ICart = {
          id: nextId,
          user_id: userId,
          product_id: productId,
          add_date: new Date().toISOString()
        };
        console.log('New cart item to be added:', newCart); // Log new item
        return newCart;
      }),
      switchMap(cartItem => {
        console.log('Making POST request with:', cartItem); // Log before POST
        return this.http.post<ICart>(this.urlAPI, cartItem);
      }),
      map(response => {
        console.log('Server response after adding to cart:', response); // Log server response
        return response;
      }),
      catchError(error => {
        console.error('Error adding to cart:', error); // Better error logging
        return this.errorHandler(error);
      })
    );
  }

  removeFromCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.urlAPI}/${cartId}`).pipe(
      map(response => {
        console.log('Removed from cart:', response);
        return response;
      }),
      catchError(this.errorHandler)
    );
  }

  checkProductInCart(userId: number, productId: number): Observable<boolean> {
    return this.getAllCarts().pipe(
      map(cart => {
        return cart.some(item => 
          item.user_id === userId && item.product_id === productId
        );
      }),
      catchError(error => {
        console.error('Error checking cart:', error);
        return of(false);
      })
    );
  }

  
}
