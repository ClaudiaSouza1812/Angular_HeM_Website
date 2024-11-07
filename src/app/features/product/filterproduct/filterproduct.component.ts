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

  filterItems$!: Observable<{
    type: string[];
    color: string[];
  }>;

  chosenItems: string[] = [];
  readonly panelOpenState = signal(false);
  @Output() filtersChanged = new EventEmitter<string[]>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.filterItems$ = this.productService.getAllProducts().pipe(
      map(products => ({
        type: [... new Set(products.map(product => product.tipo_de_produto))].sort().concat('AllTypes'),
        color: [... new Set(products.map(product => product.cor))].sort().concat('AllCollors')
      }
      ))
    )
  }

  getFilteredOptions(typeName: string){
    console.log(typeName);
    
    for (let index = 0; index < this.chosenItems.length; index++) {
      if (this.chosenItems[index] === typeName) {
        this.chosenItems.splice(index, 1);
        console.log(this.chosenItems);
        this.filtersChanged.emit(this.chosenItems);
        return;
      };
    }
    this.chosenItems.push(typeName);
    console.log(this.chosenItems);
    this.filtersChanged.emit(this.chosenItems);
  }

  getChosenItems(): string[] {
    console.log(this.chosenItems);
    return this.chosenItems;
  }

}
