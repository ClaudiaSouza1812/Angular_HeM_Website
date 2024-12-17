// Import required Angular and RxJS modules
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ICart } from '../../models/ICart';

@Injectable({
 providedIn: 'root'  // Service available throughout app
})
export class CartService {
 // API endpoint for cart operations
 private urlAPI = "http://localhost:3000/cart";

 constructor(private http: HttpClient) { }

 // Generic error handler for HTTP requests
 private errorHandler(error: HttpErrorResponse) {
   console.error('API Error:', error);
   if (error.status === 404) {
     return throwError(() => 'Recurso não encontrado');  // "Resource not found"
   } else {
     return throwError(() => `Ocorreu um erro! Status: ${error.status}, Message: ${error.message}`);
   }
 }

 // Get all cart items
 getAllCarts(): Observable<ICart[]> {
   return this.http.get<ICart[]>(this.urlAPI).pipe(
     map(cart => {
       console.log('Raw API Response:', cart);
       // Verify response is an array
       if (Array.isArray(cart)) {
         return cart;
       } else {
         throw new Error('Invalid API response format');
       }
     }),
     catchError(this.errorHandler)
   );
 }

 // Add item to cart
 addToCart(userId: number, productId: number,): Observable<ICart> {
   return this.getAllCarts().pipe(
     // Generate new cart item with next available ID
     map(cart => {
       console.log('Current cart items:', cart); 
       const maxId = cart.length > 0 ? Math.max(...cart.map(item => item.id || 0)) : 0;
       const nextId = maxId + 1;
 
       // Create new cart item
       const newCart: ICart = {
         id: nextId,
         user_id: userId,
         product_id: productId,
         add_date: new Date().toISOString()
       };
       console.log('New cart item to be added:', newCart); 
       return newCart;
     }),
     // Make POST request with new item
     switchMap(cartItem => {
       console.log('Making POST request with:', cartItem); 
       return this.http.post<ICart>(this.urlAPI, cartItem);
     }),
     // Handle response
     map(response => {
       console.log('Server response after adding to cart:', response); 
       return response;
     }),
     catchError(error => {
       console.error('Error adding to cart:', error); 
       return this.errorHandler(error);
     })
   );
 }

 // Remove item from cart
 removeFromCart(cartId: number): Observable<any> {
   return this.http.delete(`${this.urlAPI}/${cartId}`).pipe(
     map(response => {
       console.log('Removed from cart:', response);
       return response;
     }),
     catchError(this.errorHandler)
   );
 }

 // Check if product is already in user's cart
 checkProductInCart(userId: number, productId: number): Observable<boolean> {
   return this.getAllCarts().pipe(
     map(cart => {
       // Check if item exists in cart
       return cart.some(item => 
         item.user_id === userId && item.product_id === productId
       );
     }),
     catchError(error => {
       console.error('Error checking cart:', error);
       return of(false);  // Return false on error
     })
   );
 }
}
