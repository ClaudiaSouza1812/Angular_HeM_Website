import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/header/header.component";
import { TopmenuComponent } from './core/header/topmenu/topmenu.component';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './features/home/components/carousel/carousel.component';
import { HighlightComponent } from './features/home/components/highlight/highlight.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, TopmenuComponent, CarouselComponent, HighlightComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CA_RS11_P05_Angular_ClaudiaSouza';
}
