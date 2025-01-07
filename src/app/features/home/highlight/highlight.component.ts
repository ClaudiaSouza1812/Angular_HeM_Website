// Import necessary Angular dependencies
import { Component, OnInit } from '@angular/core';
// Import interface for product structure
import { IProduct } from '../../../models/IProduct';
// Import service for handling product data
import { ProductService } from '../../../core/services/product.service';
// Import error type (Note: 'error' import from console isn't needed unless specifically used)
import { error } from 'console';
// Import necessary Angular modules for standalone component
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-highlight',        // HTML tag for this component
  standalone: true,                 // Marks as standalone component
  imports: [                        // Required imports for standalone component
    CommonModule,                   // For common Angular directives
    RouterModule                    // For routing functionality
  ],
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css'
})
export class HighlightComponent implements OnInit {
  // Array to store highlighted products
  highlightedProducts: IProduct[] = [];

  // Inject ProductService through constructor
  constructor(private productService: ProductService) {}

  // Lifecycle hook that runs when component initializes
  ngOnInit(): void {
    // Call service method to get highlighted products
    this.productService.getHighlightProduct().subscribe({
      next: (products) => {
        // On success, store products in component property
        this.highlightedProducts = products;
      },
      error: (error) => {
        // On error, log to console (in Portuguese)
        console.error('Erro ao carregar produtos: ', error);
      }
    });
  }
}