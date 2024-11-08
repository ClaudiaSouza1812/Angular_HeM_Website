import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent {
  productId!: number;
  product!: Observable<IProduct>;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId =  params['id']; 
    });
    this.product = this.productService.getProduct(this.productId);
  }


}
