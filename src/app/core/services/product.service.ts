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

  getFilteredProducts(filters: { types: string[], colors: string[] }): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.urlAPI).pipe(
      map(products => {
        if (!Array.isArray(products)) {
          throw new Error('Invalid API response format');
        }
        
        return products.filter(product => {
          // Check if we should apply type filter
          const matchesType = filters.types.includes('Todos') || 
                            filters.types.includes(product.tipo_de_produto);

          // Check if we should apply color filter
          const matchesColor = filters.colors.includes('Todos') || 
                             filters.colors.includes(product.cor);

          return matchesType && matchesColor;
        });
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.urlAPI).pipe(
      map(products => {
        if (Array.isArray(products)) {
          return products;
        } else {
          throw new Error('Invalid API response format');
        }
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
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
