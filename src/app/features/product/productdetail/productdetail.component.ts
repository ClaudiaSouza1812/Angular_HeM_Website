// Import required Angular and custom modules/services
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// Import ActivatedRoute for accessing route parameters and RouterModule for navigation
import { ActivatedRoute, RouterModule } from '@angular/router';  // ActivatedRoute gives access to URL parameters
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
// Import RxJS operators for handling async operations and data transformation
import { map, Observable, switchMap } from 'rxjs';  // RxJS operators for handling route parameters and HTTP requests
import { CartService } from '../../../core/services/cart.service';
import { AutenticationService } from '../../../core/services/autentication.service';
import { IUser } from '../../../models/IUser';

@Component({
 selector: 'app-productdetail',      // Component's HTML selector
 standalone: true,                   // Marks as standalone component
 imports: [CommonModule, RouterModule], // Required imports
 templateUrl: './productdetail.component.html',
 styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent {
 // Class properties
 product!: IProduct;                // Product details (! indicates definite assignment)
 currentUser$!: IUser | null;       // Current user information
 currentUserId!: number | undefined; // User ID for cart operations

 // Inject required services
 constructor(
   private route: ActivatedRoute,           // For accessing route parameters & Inject ActivatedRoute to access URL parameters
   private productService: ProductService,   // Product-related operations
   private cartService: CartService,         // Cart-related operations
   private autenticationService: AutenticationService  // Authentication operations
 ) {}

 ngOnInit() {
   // Route parameter handling
   // Get product details based on route parameter
   this.route.params.pipe(
     // Step 1: Extract and convert the 'id' parameter from the URL
     // Example: If URL is '/productdetail/123', this gets '123' and converts it to number
     map(parameter => +parameter['id']),     // Convert string ID to number

     // Step 2: Use the extracted ID to fetch product details
     // switchMap cancels previous requests if the ID changes rapidly
     // This prevents race conditions when quickly navigating between products
     switchMap(id => this.productService.getProduct(id))  // Get product details
   ).subscribe(
     // Step 3: Once product data arrives, assign it to the component property
     // This data will be used in the template to display product details
     product => {
       this.product = product;
     });

   // Subscribe to user authentication state
   this.autenticationService.currentUser$.subscribe(
     user => {
       this.currentUser$ = user;
       this.currentUserId = user?.id;
     }
   )
 }

 // Method to handle adding product to cart
 addProductToCart() {
   // Check if user is logged in
   if (!this.currentUserId) {
     alert('Please log in to add items to cart');
     return;
   }
 
   const userId = this.currentUserId;
 
   // Check if product is already in cart
   this.cartService.checkProductInCart(userId, this.product.id).subscribe(isInCart => {
     if (!isInCart) {
       // Add product to cart if not already present
       this.cartService.addToCart(userId, this.product.id).subscribe({
         next: () => {
           // Success message in Portuguese
           alert('Produto adicionado ao carrinho de compras!');
         },
         error: () => {
           // Error message in Portuguese
           alert('Falha ao adicionar ao carrinho de compras!');
         }
       });
     } else {
       // Product already in cart message in Portuguese
       alert('Produto existente no carrinho de compras!');
     }
   });
 }
}
