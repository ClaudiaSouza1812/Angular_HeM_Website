import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { HighlightComponent } from "../home/highlight/highlight.component";
import { ListproductComponent } from "./listproduct/listproduct.component";
import { FilterproductComponent } from "./filterproduct/filterproduct.component";
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../models/IProduct';
import { AutenticationService } from '../../core/services/autentication.service';
import { IUser } from '../../models/IUser';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, HighlightComponent, ListproductComponent, FilterproductComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  
  products: IProduct[] = [];
  currentUser$!: Observable<IUser | null>;

  constructor(
    private productService: ProductService,
    private autenticationService: AutenticationService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.autenticationService.currentUser$;
    this.loadAllProducts();
  }
  
  loadAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Loaded products:', products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadFilteredProducts(chosenItems: string[]) {
    console.log('Loading filtered products with items:', chosenItems);
    if (chosenItems.length === 0) {
      this.loadAllProducts();
      return;
    }
    this.productService.getFilteredProducts(chosenItems).subscribe({
      next: (product) => {
        this.products = product;
        console.log('Filtered products:', product);
      },
      error: (error) => {
        console.error('Error loading filtered products:', error);
      }
    });
  }
  
}
