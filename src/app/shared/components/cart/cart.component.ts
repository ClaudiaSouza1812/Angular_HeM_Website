import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IProduct } from '../../../models/IProduct';
import { Observable, take } from 'rxjs';
import { IUser } from '../../../models/IUser';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AutenticationService } from '../../../core/services/autentication.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartProducts: IProduct[] = [];
  currentUser$: Observable<IUser | null>;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private autenticationService: AutenticationService
  ) {
    this.currentUser$ = this.autenticationService.currentUser$;
  }

  ngOnInit() {
    this.loadCartProducts();
  }

  loadCartProducts() {
    this.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        this.cartService.getAllCarts().subscribe({
          next: (cart) => {
            const userCart = cart.filter(item => item.user_id === user.id);
            this.productService.getAllProducts().subscribe({
              next: (products) => {
                this.cartProducts = products.filter(product => 
                  userCart.some(wish => wish.product_id === product.id)
                );
              },
              error: (error) => console.error('Error loading products:', error)
            });
          },
          error: (error) => console.error('Error loading cart:', error)
        });
      }
    });
  }

  removeFromCart(productId: number) {
    this.currentUser$.pipe(
      take(1)
    ).subscribe(user => {
      if (user) {
        this.cartService.getAllCarts().subscribe({
          next: (cart) => {
            const cartItem = cart.find(
              item => item.user_id === user.id && item.product_id === productId
            );
            
            if (cartItem && cartItem.id) {
              this.cartService.removeFromCart(cartItem.id).subscribe({
                next: () => {
                  this.cartProducts = this.cartProducts.filter(
                    product => product.id !== productId
                  );
                },
                error: (error) => console.error('Error removing from cart:', error)
              });
            }
          },
          error: (error) => console.error('Error getting cart:', error)
        });
      }
    });
  }

  get totalPrice(): number {
    return this.cartProducts.reduce((sum, product) => sum + product.preco, 0);
  }
}
