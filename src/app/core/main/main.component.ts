import { Component } from '@angular/core';
import { CarouselComponent } from "./carousel/carousel.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
