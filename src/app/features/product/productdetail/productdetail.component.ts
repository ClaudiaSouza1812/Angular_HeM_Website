import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../models/IProduct';
import { map, Observable, switchMap } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { AutenticationService } from '../../../core/services/autentication.service';
import { IUser } from '../../../models/IUser';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent {
  product!: IProduct;
  currentUser$!: IUser | null;
  currentUserId!: number | undefined;

  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService, private autenticationService: AutenticationService) {
  }

  ngOnInit() {
    this.route.params.pipe(
      map(parameter => +parameter['id']),
      switchMap(id => this.productService.getProduct(id))).subscribe(
        product => {
          this.product = product;
        });
    this.autenticationService.currentUser$.subscribe(
      user => {
        this.currentUser$ = user;
        this.currentUserId = user?.id;
      }
    )
  }

  addProductToCart() {
    if (!this.currentUserId) {
      alert('Please log in to add items to cart');
      return;
    }
  
    const userId = this.currentUserId;
  
    this.cartService.checkProductInCart(userId, this.product.id).subscribe(isInCart => {
      if (!isInCart) {
        this.cartService.addToCart(userId, this.product.id).subscribe({
          next: () => {
            alert('Produto adicionado ao carrinho de compras!');
          },
          error: () => {
            alert('Falha ao adicionar ao carrinho de compras!');
          }
        });
      } else {
        alert('Produto existente no carrinho de compras!');
      }
    });
  }

}
