import { Component, Input, OnInit } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Observable, take } from 'rxjs';
import { IUser } from '../../../models/IUser';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { AutenticationService } from '../../../core/services/autentication.service';
import { CartService } from '../../../core/services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistProducts: IProduct[] = [];
  currentUser$: Observable<IUser | null>;
  currentUserId?: number;

  constructor(private productService: ProductService, private wishlistService: WishlistService, private autenticationService: AutenticationService, private cartService: CartService
  ) {
    this.currentUser$ = this.autenticationService.currentUser$;
  }

  ngOnInit() {
    this.loadWishlistProducts();
    this.currentUser$.subscribe(user => {
      this.currentUserId = user?.id;
    });
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
                  alert('Produto removido com sucesso da Lista de desejos!');
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

  addToCart(productId: number) {
    if (!this.currentUserId) {
      alert('Please log in to add items to cart');
      return;
    }
  
    const userId = this.currentUserId;

    this.cartService.checkProductInCart(this.currentUserId, productId).subscribe(isInCart => {
      if (!isInCart) {
        this.cartService.addToCart(userId, productId).subscribe({
          next: () => {
            alert('Produto adicionado ao carrinho de compras!');
            this.removeFromWishlist(productId);
          },
          error: (error) => {
            console.error('Error adding to cart:', error);
            alert('Falha ao adicionar ao carrinho de compras!');
          }
        });
      } else {
        alert('Produto já existe no carrinho!');
      }
    });
  }



}