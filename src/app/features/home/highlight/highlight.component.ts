import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../../models/IProduct';
import { ProductService } from '../../../core/services/product.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.css'
})
export class HighlightComponent implements OnInit{

  highlightedProducts: IProduct[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getHighlightProduct().subscribe({
      next: (products) => {
        this.highlightedProducts = products;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos: ', error);
      }
    });
  }
}
