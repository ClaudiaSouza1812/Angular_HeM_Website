import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CarouselComponent } from './features/home/carousel/carousel.component';
import { HighlightComponent } from './features/home/highlight/highlight.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent, title: 'Home Page', children: [
        {path: '', component: CarouselComponent}, {path: '', component: HighlightComponent}
    ]},
];
