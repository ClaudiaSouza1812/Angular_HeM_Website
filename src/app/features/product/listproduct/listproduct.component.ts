import { Component, EventEmitter, Output, Input} from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AutenticationService } from '../../../core/services/autentication.service';
import { IUser } from '../../../models/IUser';
import { FilterproductComponent } from '../filterproduct/filterproduct.component';

interface FilterState {
  types: string[];
  colors: string[];
}

@Component({
  selector: 'app-listproduct',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './listproduct.component.html',
  styleUrl: './listproduct.component.css'
})
export class ListproductComponent {
  products: IProduct[] = [];
  productsToShow: number = 6;
  imageId: number | null = null;
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

  loadFilteredProducts(filters: FilterState) {
    console.log('Loading filtered products with filters:', filters);
    
    if (filters.types.length === 0 && filters.colors.length === 0) {
      this.loadAllProducts();
      return;
    }

    this.productService.getFilteredProducts(filters).subscribe({
      next: (products) => {
        this.products = products;
        console.log('Filtered products:', products);
      },
      error: (error) => {
        console.error('Error loading filtered products:', error);
      }
    });
  }

  showProducts(): number {
    return this.productsToShow += 6;
  }

  hasProduct(): boolean {
    return this.productsToShow < this.products.length;
  }

  handleWishList() {
    this.currentUser$.subscribe(user => {
      console.log(user?.nome);
    });
  }
}