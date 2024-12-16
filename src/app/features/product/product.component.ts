// Import necessary Angular and custom modules/components
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
import { WishlistComponent } from "../../shared/components/wishlist/wishlist.component";
import { IWishlist } from '../../models/IWishlist';

@Component({
 selector: 'app-product',
 standalone: true,
 imports: [CommonModule, ListproductComponent, FilterproductComponent],
 templateUrl: './product.component.html',
 styleUrl: './product.component.css'
})
export class ProductComponent {
 // Component properties
 products: IProduct[] = [];                    // Stores all products
 currentUser$!: Observable<IUser | null>;      // Current user observable
 starredProducts: Set<number> = new Set();     // Set of favorited product IDs
 userWishList: IWishlist[] = [];               // User's wishlist items

 // Inject required services
 constructor(
   private productService: ProductService,
   private autenticationService: AutenticationService,
   private wishlistService: WishlistService
 ) {}

  // Initialization function - called when component starts
ngOnInit(): void {
  // Store the current user observable for use throughout component
  this.currentUser$ = this.autenticationService.currentUser$;
  // Load initial product data
  this.loadAllProducts();
  // Load user's wishlist if they're logged in
  this.loadUserWishlist();
}

// Function to load all products from the service
loadAllProducts(): void {
  this.productService.getAllProducts().subscribe({
      next: (products) => {
          // Store retrieved products in component
          this.products = products;
          // Log for debugging
          console.log('Loaded products:', products);
      },
      error: (error) => {
          // Log any errors that occur during loading
          console.error('Error loading products:', error);
      }
  });
}

// Function to load the current user's wishlist
loadUserWishlist(): void {
  // Take only first emission from currentUser$ observable and then unsubscribe
  this.currentUser$.pipe(
      take(1)
  ).subscribe(user => {
      if (user) {  // Only proceed if there's a logged-in user
          this.wishlistService.getAllWishLists().subscribe({
              next: (wishlist) => {
                  // Filter wishlist to only include current user's items
                  this.userWishList = wishlist.filter(item => item.user_id === user.id);
                  // Create a Set of product IDs that are in the wishlist
                  this.starredProducts = new Set(this.userWishList.map(item => item.product_id));
              },
              error: (error) => console.error('Error loading wishlist:', error)
          });
      }
  });
}

// Function to handle adding/removing items from wishlist
handleWishList(productId: number): void {
  this.currentUser$.pipe(
      take(1)
  ).subscribe(user => {
      if (user) {  // Only proceed if there's a logged-in user
          // Check if product is already in wishlist
          this.wishlistService.checkProductInWishList(user.id, productId).pipe(
              take(1)
          ).subscribe({
              next: (isInWishlist) => {
                  if (isInWishlist) {
                      // If product is in wishlist, remove it
                      const wishlistItem = this.userWishList.find(item => item.product_id === productId);
                      if (wishlistItem && wishlistItem.id) {
                          this.wishlistService.removeFromWishList(wishlistItem.id).subscribe({
                              next: () => {
                                  // Update local state after successful removal
                                  this.starredProducts.delete(productId);
                                  this.userWishList = this.userWishList.filter(item => item.product_id !== productId);
                              },
                              error: (error) => console.error('Error removing from wishlist:', error)
                          });
                      }
                  } else {
                      // If product isn't in wishlist, add it
                      this.wishlistService.addToWishList(user.id, productId).subscribe({
                          next: (newWishlistItem) => {
                              // Update local state after successful addition
                              this.starredProducts.add(productId);
                              this.userWishList.push(newWishlistItem);
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

// Function to load filtered products based on selected criteria
loadFilteredProducts(chosenItems: string[]) {
  console.log('Loading filtered products with items:', chosenItems);
  // If no filters selected, load all products
  if (chosenItems.length === 0) {
      this.loadAllProducts();
      return;
  }
  // Get filtered products from service
  this.productService.getFilteredProducts(chosenItems).subscribe({
      next: (product) => {
          // Update products array with filtered results
          this.products = product;
          console.log('Filtered products:', product);
      },
      error: (error) => {
          console.error('Error loading filtered products:', error);
      }
  });
}

// Helper function to check if a product is in the wishlist
isProductStarred(productId: number): boolean {
  return this.starredProducts.has(productId);
}

}