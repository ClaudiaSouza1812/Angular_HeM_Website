import { Component, EventEmitter, Output, Input} from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AutenticationService } from '../../../core/services/autentication.service';
import { IUser } from '../../../models/IUser';
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
  productsToShow: number = 6;
  imageId: number | null = null;
  whishListProducts: Set<number> = new Set();

  constructor() {}

  
  showProducts(): number {
    return this.productsToShow += 6;
  }

  hasProduct(): boolean {
    return this.productsToShow < this.products.length;
  }

  handleWishList(productId: number) {
    this.currentUser$.subscribe(user => {
      console.log(user?.nome, productId);
    });
    if (this.whishListProducts.has(productId)) {
      this.whishListProducts.delete(productId);
    } else {
      this.whishListProducts.add(productId);
    }    
  }

}
