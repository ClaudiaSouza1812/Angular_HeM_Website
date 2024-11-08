import { Component, Input, OnInit } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Observable, take } from 'rxjs';
import { IWishlist } from '../../../models/IWishlist';
import { IUser } from '../../../models/IUser';
import { ListproductComponent } from "../listproduct/listproduct.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { AutenticationService } from '../../../core/services/autentication.service';

// wishlist.component.ts
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistProducts: IProduct[] = [];
  currentUser$: Observable<IUser | null>;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private autenticationService: AutenticationService
  ) {
    this.currentUser$ = this.autenticationService.currentUser$;
  }

  ngOnInit() {
    this.loadWishlistProducts();
  }

  loadWishlistProducts() {
    this.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        this.wishlistService.getAllWishLists().subscribe({
          next: (wishlist) => {
            const userWishlist = wishlist.filter(item => item.user_id === user.id);
            this.productService.getAllProducts().subscribe({
              next: (products) => {
                this.wishlistProducts = products.filter(product => 
                  userWishlist.some(wish => wish.product_id === product.id)
                );
              },
              error: (error) => console.error('Error loading products:', error)
            });
          },
          error: (error) => console.error('Error loading wishlist:', error)
        });
      }
    });
  }

  removeFromWishlist(productId: number) {
    this.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        this.wishlistService.getAllWishLists().subscribe({
          next: (wishlist) => {
            const wishlistItem = wishlist.find(
              item => item.user_id === user.id && item.product_id === productId
            );
            
            if (wishlistItem && wishlistItem.id) {
              this.wishlistService.removeFromWishList(wishlistItem.id).subscribe({
                next: () => {
                  this.wishlistProducts = this.wishlistProducts.filter(
                    product => product.id !== productId
                  );
                },
                error: (error) => console.error('Error removing from wishlist:', error)
              });
            }
          },
          error: (error) => console.error('Error getting wishlist:', error)
        });
      }
    });
  }
}