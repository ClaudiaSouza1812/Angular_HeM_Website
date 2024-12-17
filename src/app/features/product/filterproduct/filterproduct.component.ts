// Import necessary Angular and Material modules
import { CommonModule } from '@angular/common';
import { Component, Output, signal, EventEmitter } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { ProductService } from '../../../core/services/product.service';
import { map, Observable } from 'rxjs';
import { IProduct } from '../../../models/IProduct';

@Component({
 selector: 'app-filterproduct',
 standalone: true,
 imports: [CommonModule, MatExpansionModule, MatCheckboxModule],
 templateUrl: './filterproduct.component.html',
 styleUrl: './filterproduct.component.css'
})
export class FilterproductComponent {

 // Observable that will hold our filter options
 filterItems$!: Observable<{
   type: string[];    // Array of product types
   color: string[];   // Array of product colors
 }>;

 chosenItems: string[] = [];                     // Tracks selected filter options
 readonly panelOpenState = signal(false);        // Tracks expansion panel state
 @Output() filtersChanged = new EventEmitter<string[]>();  // Emits when filters change

 constructor(private productService: ProductService) {}

 // Initialize component and set up filter options
 ngOnInit() {
   this.filterItems$ = this.productService.getAllProducts().pipe(
     map(products => ({
       // Create unique sorted arrays of types and colors using Set
       type: [... new Set(products.map(product => product.tipo_de_produto))].sort().concat('AllTypes'),
       color: [... new Set(products.map(product => product.cor))].sort().concat('AllCollors')
     }
     ))
   )
 }

 // Emit filtered options to parent component
 updateFilters(filters: string[]) {
   this.filtersChanged.emit(filters);
 }
 
 // Handle checkbox changes for filter options
 getFilteredOptions(typeName: string){
   console.log(typeName);
   
   // Check if option is already selected
   for (let index = 0; index < this.chosenItems.length; index++) {
     if (this.chosenItems[index] === typeName) {
       // Remove option if already selected
       this.chosenItems.splice(index, 1);
       console.log(this.chosenItems);
       this.filtersChanged.emit(this.chosenItems);
       return;
     };
   }
   // Add new option if not already selected
   this.chosenItems.push(typeName);
   console.log(this.chosenItems);
   this.filtersChanged.emit(this.chosenItems);
 }

 // Helper method to get current filter selections
 getChosenItems(): string[] {
   console.log(this.chosenItems);
   return this.chosenItems;
 }
}
