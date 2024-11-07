import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IProduct } from '../../../models/IProduct';
import { IUser } from '../../../models/IUser';
import { Observable } from 'rxjs';
import { FilterproductComponent } from '../filterproduct/filterproduct.component';

@Component({
  selector: 'app-listproduct',
  standalone: true,
  imports: [CommonModule, MatIconModule, FilterproductComponent],
  templateUrl: './listproduct.component.html',
  styleUrl: './listproduct.component.css'
})
export class ListproductComponent {

  @Input() products: IProduct[] = [];
  @Input() currentUser$!: Observable<IUser | null>;
  @Input() starredProducts!: Set<number>;
  @Output() toggleWishlist = new EventEmitter<number>();
  
  productsToShow: number = 6;
  imageId: number | null = null;

  constructor() {}

  handleWishList(productId: number) {
    this.toggleWishlist.emit(productId);
  }

  isProductStarred(productId: number): boolean {
    return this.starredProducts.has(productId);
  }

  showProducts(): number {
    return this.productsToShow += 6;
  }

  hasProduct(): boolean {
    return this.productsToShow < this.products.length || false;
  }

}
