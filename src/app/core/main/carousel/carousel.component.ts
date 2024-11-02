import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CarouselItem } from '../../../interfaces/carousel-item';
import { CarouselService } from '../../../data/carousel.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  providers: [CarouselService]
})
export class CarouselComponent implements OnInit, OnDestroy {
  images: CarouselItem[] = [];
  currentIndex = 0;
  private autoSlideSubscription?: Subscription;

  constructor(
    private carouselService: CarouselService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    try {
      this.images = this.carouselService.getCarouselItems();
      if (isPlatformBrowser(this.platformId)) {
        this.startAutoSlide();
      }
    } catch (error) {
      console.error('Error initializing carousel:', error);
      // Handle the error appropriately
      this.images = []; // Set a default value
    }
  }

  ngOnDestroy() {
    if (this.autoSlideSubscription) {
      this.autoSlideSubscription.unsubscribe();
    }
  }

  private startAutoSlide() {
    if (isPlatformBrowser(this.platformId)) {
      this.autoSlideSubscription = interval(3000).subscribe(() => {
        this.nextSlide();
      });
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  setCurrentSlide(index: number) {
    this.currentIndex = index;
  }
}