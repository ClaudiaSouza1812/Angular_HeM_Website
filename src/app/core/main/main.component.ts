import { Component } from '@angular/core';
import { CarouselComponent } from "./carousel/carousel.component";
import { HighlightComponent } from "./highlight/highlight.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CarouselComponent, HighlightComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
