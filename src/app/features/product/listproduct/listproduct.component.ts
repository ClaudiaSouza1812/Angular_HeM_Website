import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AutenticationService } from '../../../core/services/autentication.service';
import { IUser } from '../../../models/IUser';

@Component({
  selector: 'app-listproduct',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './listproduct.component.html',
  styleUrl: './listproduct.component.css'
})
export class ListproductComponent {

  productsToShow: number = 6;
  products: IProduct[] = [];
  imageId: number | null = null;
  currentUser$!: Observable<IUser | null>;

  constructor(private productService: ProductService, private autenticationService: AutenticationService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (product) => {
        this.products = product;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos: ', error);
      }
    });
    this.currentUser$ = this.autenticationService.currentUser$;
  }

  showProducts(): number {
    return this.productsToShow +=6;
  }

  hasProduct(): boolean {
    return this.productsToShow < this.products.length;
  }

  handleWishList() {
    this.currentUser$.subscribe(user => {
      console.log(user?.nome)})
      
  }
  
}
