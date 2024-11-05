import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HighlightComponent } from "../home/highlight/highlight.component";
import { ListproductComponent } from "./listproduct/listproduct.component";
import { FilterproductComponent } from "./filterproduct/filterproduct.component";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, HighlightComponent, ListproductComponent, FilterproductComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

}
