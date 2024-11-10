import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CarouselComponent } from './features/home/carousel/carousel.component';
import { HighlightComponent } from './features/home/highlight/highlight.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { ProductComponent } from './features/product/product.component';
import { WishlistComponent } from './shared/components/wishlist/wishlist.component';
import { ProductdetailComponent } from './features/product/productdetail/productdetail.component';
import { CartComponent } from './shared/components/cart/cart.component';
import { RegistrationComponent } from './shared/components/registration/registration.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent, title: 'Home Page', children: [
        {path: '', component: CarouselComponent}, {path: '', component: HighlightComponent}
    ]},
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'registration', component: RegistrationComponent, title: 'Registration'},
    {path: 'product', component: ProductComponent, title: 'Product'},
    {path: 'productdetail/:id', component: ProductdetailComponent, title: 'Product Detail'},
    {path: 'wishlist', component: WishlistComponent, title: 'Wishlist'},
    {path: 'cart', component: CartComponent, title: 'Cart'},
    {path: '**', component: NotfoundComponent, title: 'Page not found'}
];
