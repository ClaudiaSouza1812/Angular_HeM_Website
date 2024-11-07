import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IProduct } from '../../models/IProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlAPI = "http://localhost:3000/produtos";

  constructor(private http: HttpClient) { }

  private errorHandler(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.status === 404) {
      return throwError(() => 'Recurso não encontrado');
    } else {
      return throwError(() => `Ocorreu um erro! Status: ${error.status}, Message: ${error.message}`);
    }
  }

  getHighlightProduct(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.urlAPI).pipe(
      map(products => {
        console.log('Raw API Response:', products); // Debug log
        if (Array.isArray(products)) {
          return products.filter(product => product.categoria === 'destaque');
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getFilteredProducts(chosenItems: string[]): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.urlAPI).pipe(
      map(products => {
        console.log('Raw API Response:', products);
        console.log('Chosen Items:', chosenItems);
        
        if (Array.isArray(products)) {
          // Return all products if no filters or if only one "All" is selected
          if (chosenItems.length === 0 || 
              (chosenItems.length === 1 && (chosenItems.includes('AllTypes') || chosenItems.includes('AllCollors'))) ||
              (chosenItems.includes('AllTypes') && chosenItems.includes('AllCollors'))) {
            return products;
          } 

          // If AllTypes is selected with other filters, filter by colors
          if (chosenItems.includes('AllTypes')) {
            return products.filter(product =>  
              chosenItems.some(item => item !== 'AllTypes' && item === product.cor));
          } 

          // If AllCollors is selected with other filters, filter by types
          if (chosenItems.includes('AllCollors')) {
            return products.filter(product =>  
              chosenItems.some(item => item !== 'AllCollors' && item === product.tipo_de_produto));
          } 

          // If only one filter is selected (not "All")
          if (chosenItems.length === 1) {
            return products.filter(product => 
              chosenItems.includes(product.tipo_de_produto) || 
              chosenItems.includes(product.cor));
          }

          // If multiple specific filters selected (not "All")
          return products.filter(product => 
            chosenItems.includes(product.tipo_de_produto) && 
            chosenItems.includes(product.cor));
        } 
        
        throw new Error('Invalid API response format');
      }),
      catchError(this.errorHandler)
    );
}

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.urlAPI).pipe(
      map(products => {
        console.log('Raw API Response:', products); // Debug log
        if (Array.isArray(products)) {
          return products;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getProduct(): Observable<IProduct> {
    return this.http.get<IProduct>(this.urlAPI).pipe(
      map(product => {
        console.log('Raw API Response:', product); // Debug log
        if (product) {
          return product;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  
}
