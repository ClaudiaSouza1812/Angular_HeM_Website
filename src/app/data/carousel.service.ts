import { Injectable } from '@angular/core';
import { CarouselItem } from '../interfaces/carousel-item';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private carouselItems: CarouselItem[] = [
    {
      title: 'Slide 1',
      image: '/slider1.jpg'
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
  constructor() { }

  getCarouselItems(): CarouselItem[] {
    return this.carouselItems;
  }
}
