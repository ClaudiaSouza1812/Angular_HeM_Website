// Import required dependencies from Angular and RxJS libraries
import { Injectable } from '@angular/core';               // Enables dependency injection
import { HttpClient, HttpErrorResponse } from '@angular/common/http';  // For making HTTP requests and handling errors
import { catchError, map, Observable, throwError } from 'rxjs';  // RxJS utilities for handling asynchronous data
import { IProduct } from '../../models/IProduct';         // Import product interface definition

// Mark this class as injectable service that is provided at root level (singleton)
@Injectable({
 providedIn: 'root'  // Makes service available throughout the application as a singleton instance
})
export class ProductService {
 // Base URL for the products API endpoint
 private urlAPI = "http://localhost:3000/produtos";  // Development server endpoint for products

 // Inject HttpClient service for making HTTP requests
 constructor(private http: HttpClient) { }

 // Centralized error handling method for HTTP requests
 private errorHandler(error: HttpErrorResponse) {
   console.error('API Error:', error);  // Log full error details to console
   
   // Return user-friendly error message based on error type
   if (error.status === 404) {
     return throwError(() => 'Recurso não encontrado');  // Resource not found error in Portuguese
   } else {
     // Generic error message with status code and message
     return throwError(() => `Ocorreu um erro! Status: ${error.status}, Message: ${error.message}`);
   }
 }

 // Retrieve highlighted/featured products from the API
 getHighlightProduct(): Observable<IProduct[]> {
   return this.http.get<IProduct[]>(this.urlAPI).pipe(  // Make GET request to API
     map(products => {
       console.log('Raw API Response:', products);  // Debug log of raw API response
       
       // Verify response is an array before processing
       if (Array.isArray(products)) {
         // Filter products to only return those marked as featured ('destaque')
         return products.filter(product => product.categoria === 'destaque');
       } else {
         // Throw error if response format is unexpected
         throw new Error('Invalid API response format');
       }
     }),
     catchError(this.errorHandler)  // Handle any errors that occur
   );
 }

 // Get filtered products based on selected types and colors
 getFilteredProducts(chosenItems: string[]): Observable<IProduct[]> {
   return this.http.get<IProduct[]>(this.urlAPI).pipe(
     map(products => {
       // Debug logging
       console.log('Raw API Response:', products);
       console.log('Chosen Items:', chosenItems);
       
       // Verify response is an array before processing
       if (Array.isArray(products)) {
         // Return all products if no filters are applied or "All" options are selected
         if (chosenItems.length === 0 || 
             (chosenItems.length === 1 && (chosenItems.includes('AllTypes') || chosenItems.includes('AllCollors'))) ||
             (chosenItems.includes('AllTypes') && chosenItems.includes('AllCollors'))) {
           return products;
         } 

         // Filter by colors only if "All Types" is selected
         if (chosenItems.includes('AllTypes')) {
           return products.filter(product =>  
             chosenItems.some(item => item !== 'AllTypes' && item === product.cor));
         } 

         // Filter by types only if "All Colors" is selected
         if (chosenItems.includes('AllCollors')) {
           return products.filter(product =>  
             chosenItems.some(item => item !== 'AllCollors' && item === product.tipo_de_produto));
         } 

         // Handle single filter selection (either type or color)
         if (chosenItems.length === 1) {
           return products.filter(product => 
             chosenItems.includes(product.tipo_de_produto) || 
             chosenItems.includes(product.cor));
         }

         // Apply both type and color filters when both are selected
         return products.filter(product => 
           chosenItems.includes(product.tipo_de_produto) && 
           chosenItems.includes(product.cor));
       } 
       
       // Throw error if response format is unexpected
       throw new Error('Invalid API response format');
     }),
     catchError(this.errorHandler)  // Handle any errors that occur
   );
 }

 // Retrieve all products from the API without filtering
 getAllProducts(): Observable<IProduct[]> {
   return this.http.get<IProduct[]>(this.urlAPI).pipe(
     map(products => {
       console.log('Raw API Response:', products);  // Debug log
       
       // Verify response is an array before returning
       if (Array.isArray(products)) {
         return products;
       } else {
         throw new Error('Invalid API response format');
       }
     }),
     catchError(this.errorHandler)  // Handle any errors that occur
   );
 }

 // Get a single product by its ID
 getProduct(productId: number): Observable<IProduct> {
   return this.http.get<IProduct[]>(this.urlAPI).pipe(
     map(products => {
       console.log('Raw API Response:', products);  // Debug log
       
       // Verify response is an array before processing
       if (Array.isArray(products)) {
         // Find product with matching ID
         const product = products.find(product => product.id === productId);
         if (product) {
           return product;
         }
         // Throw error if product isn't found
         throw new Error('Product does not exist');
       } else {
         // Throw error if response format is unexpected
         throw new Error('Invalid API response');
       }
     }),
     catchError(this.errorHandler)  // Handle any errors that occur
   );
 }
}
