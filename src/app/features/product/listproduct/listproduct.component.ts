import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listproduct',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listproduct.component.html',
  styleUrl: './listproduct.component.css'
})
export class ListproductComponent {

  products: IProduct[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (product) => {
        this.products = product;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos: ', error);
      }
    });
  }

  
  
}
