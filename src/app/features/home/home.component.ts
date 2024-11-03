import { Component } from '@angular/core';
import { CarouselComponent } from './carousel/carousel.component';
import { HighlightComponent } from './highlight/highlight.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, HighlightComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}