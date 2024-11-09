import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent {
  productId!: number;
  product!: IProduct;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    this.route.params.pipe(
      map(parameter => +parameter['id']),
      switchMap(id => this.productService.getProduct(id))).subscribe(
        product => {
          this.product = product;
        });
  }


}
