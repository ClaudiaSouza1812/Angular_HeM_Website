import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ICarouselItem } from '../../../models/ICarousel-item';
import { CarouselService } from '../../../core/services/carousel.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  providers: [CarouselService]
})

export class CarouselComponent implements OnInit, OnDestroy {
  images: ICarouselItem[] = [];
  currentIndex = 0;
  private autoSlideSubscription?: Subscription;

  constructor(private carouselService: CarouselService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    try {
      this.images = this.carouselService.getCarouselItems();
      // Only start auto-slide in browser
      if (isPlatformBrowser(this.platformId)) {
        this.startAutoSlide();
      }
    } catch (error) {
      console.error('Error initializing carousel:', error);
      this.images = [];
    }
  }

  ngOnDestroy() {
    this.autoSlideSubscription?.unsubscribe();
  }

  private startAutoSlide() {
    this.autoSlideSubscription = interval(3000).subscribe(() => {
      this.nextSlide();
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  setCurrentSlide(index: number) {
    this.currentIndex = index;
  }
}