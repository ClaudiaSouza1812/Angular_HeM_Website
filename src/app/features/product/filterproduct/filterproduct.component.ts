import { CommonModule } from '@angular/common';
import { Component, Output, signal, EventEmitter } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ProductService } from '../../../core/services/product.service';
import { map, Observable } from 'rxjs';

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
        type: [...new Set(products.map(product => product.tipo_de_produto))].sort(),
        color: [...new Set(products.map(product => product.cor))].sort()
      }))
    );
  }

  isItemSelected(item: string): boolean {
    return this.chosenItems.includes(item);
  }

  getFilteredOptions(item: string) {
    const index = this.chosenItems.indexOf(item);
    if (index > -1) {
      this.chosenItems.splice(index, 1);
    } else {
      if (item === 'Todos') {
        this.chosenItems = [];
      } else {
        const todosIndex = this.chosenItems.indexOf('Todos');
        if (todosIndex > -1) {
          this.chosenItems.splice(todosIndex, 1);
        }
        this.chosenItems.push(item);
      }
    }
    this.filtersChanged.emit(this.chosenItems);
  }
}
