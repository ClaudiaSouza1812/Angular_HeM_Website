import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselItem } from '../../../interfaces/carousel-item';
import { CarouselService } from '../../../data/carousel.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  
  carouselItems: CarouselItem[] = [];
  @Input() autoPlay: boolean = false;
  @Input() interval: number = 5000;

  currentIndex: number = 0;
  private autoPlayInterval: any;
  private isBrowser: boolean;

  constructor(
    private carouselService: CarouselService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // Get items synchronously to avoid hydration issues
    this.carouselItems = this.carouselService.getCarouselItems();
    
    if (this.isBrowser) {
      // Delay autoPlay start to help with hydration
      setTimeout(() => {
        if (this.autoPlay) {
          this.startAutoPlay();
        }
      }, 0);
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  next() {
    if (this.carouselItems.length > 1) {
      this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
    }
  }

  previous() {
    if (this.carouselItems.length > 1) {
      this.currentIndex = (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    }
  }

  handleImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
  }

  private startAutoPlay() {
    if (this.isBrowser) {
      // Run autoPlay outside Angular's zone to prevent hydration issues
      this.ngZone.runOutsideAngular(() => {
        this.autoPlayInterval = setInterval(() => {
          this.ngZone.run(() => {
            this.next();
          });
        }, this.interval);
      });
    }
  }

  private stopAutoPlay() {
    if (this.isBrowser && this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}