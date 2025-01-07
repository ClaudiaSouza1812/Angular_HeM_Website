
import { Routes } from '@angular/router';
// Feature components imports
import { HomeComponent } from './features/home/home.component';
import { CarouselComponent } from './features/home/carousel/carousel.component';
import { HighlightComponent } from './features/home/highlight/highlight.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { ProductComponent } from './features/product/product.component';
// Shared components imports
import { WishlistComponent } from './shared/components/wishlist/wishlist.component';
import { ProductdetailComponent } from './features/product/productdetail/productdetail.component';
import { CartComponent } from './shared/components/cart/cart.component';
import { RegistrationComponent } from './shared/components/registration/registration.component';
import { ListuserComponent } from './shared/components/registration/listuser/listuser.component';

/* page title commented because it override the static title (H&M – Loja) on index.html */
export const routes: Routes = [
    // Home route with nested child routes for carousel and highlight components
    {path: 'home', component: HomeComponent, /* title: 'Home Page', */ children: [
        {path: '', component: CarouselComponent}, {path: '', component: HighlightComponent}
    ]},
    // Default route - redirects empty path to home
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    // User registration route
    {path: 'registration', component: RegistrationComponent, /* title: 'Registration' */},
    // Product-related routes
    {path: 'product', component: ProductComponent, /* title: 'Product' */},
    // Dynamic route with ID parameter
    {path: 'productdetail/:id', component: ProductdetailComponent, /* title: 'Product Detail' */},
    // Shopping features routes
    {path: 'wishlist', component: WishlistComponent, /* title: 'Wishlist' */},
    {path: 'cart', component: CartComponent, /* title: 'Cart' */},
    // User management route
    {path: 'listuser', component: ListuserComponent, /* title: 'List User' */},
    // Wildcard route - handles non-matching URLs
    {path: '**', component: NotfoundComponent, /* title: 'Page not found' */}
];
