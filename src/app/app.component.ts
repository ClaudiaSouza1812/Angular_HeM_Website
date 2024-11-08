import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopmenuComponent } from './shared/components/topmenu/topmenu.component';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './features/home/carousel/carousel.component';
import { HighlightComponent } from './features/home/highlight/highlight.component';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HomeComponent } from "./features/home/home.component";
import { LoginmodalComponent } from "./shared/components/loginmodal/loginmodal.component";
import { LogoutmodalComponent } from "./shared/components/logoutmodal/logoutmodal.component";
import { NotfoundComponent } from './features/notfound/notfound.component';
import { ProductComponent } from './features/product/product.component';
import { WishlistComponent } from './features/product/wishlist/wishlist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopmenuComponent, FooterComponent, LoginmodalComponent, LogoutmodalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CA_RS11_P05_Angular_ClaudiaSouza';
}
