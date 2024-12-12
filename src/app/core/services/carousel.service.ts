// Import required dependencies from Angular
import { Injectable } from '@angular/core';
// Import the interface that defines the structure of carousel items
import { ICarouselItem } from '../../models/ICarousel-item';

// Decorator that marks this class as an injectable service
// providedIn: 'root' means this service is available throughout the app
@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  // Private array that holds carousel item data
  // Only accessible within this service
  private carouselItems: ICarouselItem[] = [
    {
      title: 'Slide 1',   // Title for first slide
      image: '/slider1.jpg'  // Image path for first slide
    },
    {
      title: 'Slide 2',
      image: '/slider2.jpg'
    },
    {
      title: 'Slide 3',
      image: '/slider3.jpg'
    }
  ]

  // Empty constructor as no initialization is needed
  constructor() { }

  // Public method to access the carousel items
  // Returns the entire array of carousel items
  getCarouselItems(): ICarouselItem[] {
    return this.carouselItems;
  }
}
