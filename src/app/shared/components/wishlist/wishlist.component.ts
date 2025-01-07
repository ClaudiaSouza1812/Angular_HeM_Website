// Import required Angular and custom modules/services
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
 // Component properties
 wishlistProducts: IProduct[] = [];            // Stores wishlist products
 currentUser$: Observable<IUser | null>;       // Current user observable
 currentUserId?: number;                       // Stores current user ID

 // Inject required services
 constructor(
   private productService: ProductService,
   private wishlistService: WishlistService,
   private autenticationService: AutenticationService,
   private cartService: CartService
 ) {
   this.currentUser$ = this.autenticationService.currentUser$;
 }

 // Initialize component
 ngOnInit() {
   this.loadWishlistProducts();  // Load initial wishlist
   // Store current user ID
   this.currentUser$.subscribe(user => {
     this.currentUserId = user?.id;
   });
 }

 // Load products in user's wishlist
 loadWishlistProducts() {
   this.currentUser$.pipe(
     take(1)
   ).subscribe(user => {
     if (user) {
       // Get all wishlists and filter for current user
       this.wishlistService.getAllWishLists().subscribe({
         next: (wishlist) => {
           const userWishlist = wishlist.filter(item => item.user_id === user.id);
           // Get all products and filter for wishlist items
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

 // Remove item from wishlist
 removeFromWishlist(productId: number) {
   this.currentUser$.pipe(
     take(1)
   ).subscribe(user => {
     if (user) {
       // Find wishlist item to remove
       this.wishlistService.getAllWishLists().subscribe({
         next: (wishlist) => {
           const wishlistItem = wishlist.find(
             item => item.user_id === user.id && item.product_id === productId
           );
           
           if (wishlistItem && wishlistItem.id) {
             // Remove item and update local state
             this.wishlistService.removeFromWishList(wishlistItem.id).subscribe({
               next: () => {
                 this.wishlistProducts = this.wishlistProducts.filter(
                   product => product.id !== productId
                 );
                 alert('Produto removido com sucesso da Lista de Desejos!');
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

 // Add wishlist item to cart
 addToCart(productId: number) {
   // Check if user is logged in
   if (!this.currentUserId) {
     alert('Please log in to add items to cart');
     return;
   }
 
   const userId = this.currentUserId;

   // Check if product already in cart
   this.cartService.checkProductInCart(this.currentUserId, productId).subscribe(isInCart => {
     if (!isInCart) {
       // Add to cart and remove from wishlist
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