import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { HighlightComponent } from "../home/highlight/highlight.component";
import { ListproductComponent } from "./listproduct/listproduct.component";
import { FilterproductComponent } from "./filterproduct/filterproduct.component";
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../models/IProduct';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, HighlightComponent, ListproductComponent, FilterproductComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  
  onFiltersChanged(filters: string[]) {
    // Get reference to ListproductComponent using ViewChild if needed
    // this.listproductComponent.loadFilteredProducts(filters);
  }
  
}
