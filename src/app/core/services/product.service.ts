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
        console.log('Raw API Response:', products); 
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
          if (chosenItems.length === 0 || 
              (chosenItems.length === 1 && (chosenItems.includes('AllTypes') || chosenItems.includes('AllCollors'))) ||
              (chosenItems.includes('AllTypes') && chosenItems.includes('AllCollors'))) {
            return products;
          } 

          if (chosenItems.includes('AllTypes')) {
            return products.filter(product =>  
              chosenItems.some(item => item !== 'AllTypes' && item === product.cor));
          } 

          if (chosenItems.includes('AllCollors')) {
            return products.filter(product =>  
              chosenItems.some(item => item !== 'AllCollors' && item === product.tipo_de_produto));
          } 

          if (chosenItems.length === 1) {
            return products.filter(product => 
              chosenItems.includes(product.tipo_de_produto) || 
              chosenItems.includes(product.cor));
          }

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
        console.log('Raw API Response:', products); 
        if (Array.isArray(products)) {
          return products;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getProduct(productId: number): Observable<IProduct> {
    return this.http.get<IProduct[]>(this.urlAPI).pipe(
      map(products => {
        console.log('Raw API Response:', products);
        if (Array.isArray(products)) {
          const product = products.find(product => product.id === productId);
          if (product) {
            return product;
          }
          throw new Error('Product does not exist');
        } else {
          throw new Error('Invalid API response');
        }
      }),
      catchError(this.errorHandler)
    );
  }

  
}
