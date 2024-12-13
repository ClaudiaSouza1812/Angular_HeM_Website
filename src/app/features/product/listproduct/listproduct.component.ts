// Import necessary modules and interfaces from Angular and Material
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IProduct } from '../../../models/IProduct';
import { IUser } from '../../../models/IUser';
import { Observable } from 'rxjs';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
 selector: 'app-listproduct',              // Component's HTML selector tag
 standalone: true,                         // Marks as standalone component
 imports: [CommonModule, MatIconModule, RouterModule],  // Required imports
 templateUrl: './listproduct.component.html',
 styleUrl: './listproduct.component.css'
})
export class ListproductComponent {
 // Input properties receiving data from parent component
 @Input() products: IProduct[] = [];           // Array of products to display
 @Input() currentUser$!: Observable<IUser | null>;  // Current user observable
 @Input() starredProducts!: Set<number>;      // Set of products marked as favorites

 // Output event emitter to notify parent of wishlist changes
 @Output() toggleWishlist = new EventEmitter<number>();

 // Component properties
 productsToShow: number = 6;                  // Initial number of products to display
 imageId: number | null = null;               // Tracks which product image is being hovered

 constructor() {}

 // Emit event when wishlist toggle is clicked
 handleWishList(productId: number) {
   this.toggleWishlist.emit(productId);
 }

 // Check if a product is in the wishlist
 isProductStarred(productId: number): boolean {
   return this.starredProducts.has(productId);
 }

 // Increase number of products shown when "Show More" is clicked
 showProducts(): number {
   return this.productsToShow += 6;           // Increases display count by 6
 }

 // Check if there are more products to show
 hasProduct(): boolean {
   return this.productsToShow < this.products.length || false;
 }
}