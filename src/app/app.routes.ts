import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CarouselComponent } from './features/home/carousel/carousel.component';
import { HighlightComponent } from './features/home/highlight/highlight.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { ProductComponent } from './features/product/product.component';
import { WishlistComponent } from './features/product/wishlist/wishlist.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent, title: 'Home Page', children: [
        {path: '', component: CarouselComponent}, {path: '', component: HighlightComponent}
    ]},
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'product', component: ProductComponent, title: 'Product'},
    {path: 'wishlist', component: WishlistComponent, title: 'Wishlist'},
    {path: '**', component: NotfoundComponent, title: 'Page not found'}
];
