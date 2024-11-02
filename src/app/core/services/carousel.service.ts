import { Injectable } from '@angular/core';
import { ICarouselItem } from '../../models/ICarousel-item';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private carouselItems: ICarouselItem[] = [
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

  getCarouselItems(): ICarouselItem[] {
    return this.carouselItems;
  }
}
