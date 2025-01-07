// Component imports
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
    standalone: true,  // Makes component independent of NgModule
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css',
    providers: [CarouselService]  // Component-level service instance
})
export class CarouselComponent implements OnInit, OnDestroy {
  
    // Array to hold carousel images
    images: ICarouselItem[] = [];
    // Tracks current slide index
    currentIndex = 0;
    // Holds subscription for auto-sliding
    private autoSlideSubscription?: Subscription;

    constructor(
        private carouselService: CarouselService,
        @Inject(PLATFORM_ID) private platformId: Object  // For platform detection
    ) {}

    ngOnInit() {
        try {
            // Load carousel images
            this.images = this.carouselService.getCarouselItems();
            
            // Start auto-slide only if in browser
            if (isPlatformBrowser(this.platformId)) {
                this.startAutoSlide();
            }
        } catch (error) {
            console.error('Error initializing carousel:', error);
            this.images = [];  // Reset to empty array if error occurs
        }
    }

    ngOnDestroy() {
        // Clean up subscription when component is destroyed
        this.autoSlideSubscription?.unsubscribe();
    }

    private startAutoSlide() {
        // Create timer that advances slide every 3 seconds
        this.autoSlideSubscription = interval(3000).subscribe(() => {
            this.nextSlide();
        });
    }

    nextSlide() {
        // Move to next slide, wrap to start if at end
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }

    setCurrentSlide(index: number) {
        // Manually set current slide
        this.currentIndex = index;
    }
}