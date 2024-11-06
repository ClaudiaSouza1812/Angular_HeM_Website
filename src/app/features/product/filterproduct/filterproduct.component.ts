import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
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

  filterItems$!: Observable<{
    type: string[];
    color: string[];
  }>;

  readonly panelOpenState = signal(false);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.filterItems$ = this.productService.getAllProducts().pipe(
      map(products => ({
        type: [... new Set(products.map(product => product.tipo_de_produto))].sort(),
        color: [... new Set(products.map(product => product.cor))].sort()
      }
      ))
    )
  }


}
