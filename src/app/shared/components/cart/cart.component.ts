// Import necessary modules and services
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IProduct } from '../../../models/IProduct';
import { Observable, take } from 'rxjs';
import { IUser } from '../../../models/IUser';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AutenticationService } from '../../../core/services/autentication.service';
import { RouterModule } from '@angular/router';

@Component({
 selector: 'app-cart',
 standalone: true,
 imports: [CommonModule, RouterModule],
 templateUrl: './cart.component.html',
 styleUrl: './cart.component.css'
})
export class CartComponent {
 // Component properties
 cartProducts: IProduct[] = [];              // Array to store cart products
 currentUser$: Observable<IUser | null>;     // Observable for current user

 // Inject required services
 constructor(
   private productService: ProductService,
   private cartService: CartService,
   private autenticationService: AutenticationService
 ) {
   this.currentUser$ = this.autenticationService.currentUser$;
 }

 // Initialize component
 ngOnInit() {
   this.loadCartProducts();  // Load cart items on init
 }

 // Load products in user's cart
 loadCartProducts() {
   this.currentUser$.pipe(
     take(1)  // Take only first emission and unsubscribe
   ).subscribe(user => {
     if (user) {
       // Get all carts and filter for current user
       this.cartService.getAllCarts().subscribe({
         next: (cart) => {
           const userCart = cart.filter(item => item.user_id === user.id);
           // Get all products and filter for cart items
           this.productService.getAllProducts().subscribe({
             next: (products) => {
               this.cartProducts = products.filter(product => 
                 userCart.some(wish => wish.product_id === product.id)
               );
             },
             error: (error) => console.error('Error loading products:', error)
           });
         },
         error: (error) => console.error('Error loading cart:', error)
       });
     }
   });
 }

 // Remove item from cart
 removeFromCart(productId: number) {
   this.currentUser$.pipe(
     take(1)
   ).subscribe(user => {
     if (user) {
       // Find cart item to remove
       this.cartService.getAllCarts().subscribe({
         next: (cart) => {
           const cartItem = cart.find(
             item => item.user_id === user.id && item.product_id === productId
           );
           
           if (cartItem && cartItem.id) {
             // Remove item and update local state
             this.cartService.removeFromCart(cartItem.id).subscribe({
               next: () => {
                 this.cartProducts = this.cartProducts.filter(
                   product => product.id !== productId
                 );
               },
               error: (error) => console.error('Error removing from cart:', error)
             });
           }
         },
         error: (error) => console.error('Error getting cart:', error)
       });
     }
   });
 }

 // Calculate total price of items in cart
 get totalPrice(): number {
   return this.cartProducts.reduce((sum, product) => sum + product.preco, 0);
 }
}
