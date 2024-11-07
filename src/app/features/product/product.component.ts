import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { HighlightComponent } from "../home/highlight/highlight.component";
import { ListproductComponent } from "./listproduct/listproduct.component";
import { FilterproductComponent } from "./filterproduct/filterproduct.component";
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../models/IProduct';
import { AutenticationService } from '../../core/services/autentication.service';
import { IUser } from '../../models/IUser';
import { map, Observable, take } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist.service';

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
  starredProducts: Set<number> = new Set();

  constructor(
    private productService: ProductService,
    private autenticationService: AutenticationService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.autenticationService.currentUser$;
    this.loadAllProducts();
    this.loadUserWishlist();
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

  loadUserWishlist() {
    this.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        this.wishlistService.getAllWishLists().subscribe({
          next: (wishlist) => {
            const userWishlist = wishlist.filter(item => item.user_id === user.id);
            this.starredProducts = new Set(userWishlist.map(item => item.product_id));
          },
          error: (error) => console.error('Error loading wishlist:', error)
        });
      }
    });
  }

  handleWishList(productId: number) {
    this.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        this.wishlistService.checkProductInWishList(user.id, productId).pipe(
          take(1)
        ).subscribe({
          next: (isInWishlist) => {
            if (isInWishlist) {
              this.wishlistService.removeFromWishList(user.id, productId).subscribe({
                next: () => {
                  this.starredProducts.delete(productId);
                },
                error: (error) => console.error('Error removing from wishlist:', error)
              });
            } else {
              this.wishlistService.addToWishList(user.id, productId).subscribe({
                next: () => {
                  this.starredProducts.add(productId);
                },
                error: (error) => console.error('Error adding to wishlist:', error)
              });
            }
          },
          error: (error) => console.error('Error checking wishlist:', error)
        });
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

  isProductStarred(productId: number): boolean {
    return this.starredProducts.has(productId);
  }
  
}
