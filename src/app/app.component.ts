import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopmenuComponent } from './shared/components/topmenu/topmenu.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { LoginmodalComponent } from "./shared/components/loginmodal/loginmodal.component";
import { LogoutmodalComponent } from "./shared/components/logoutmodal/logoutmodal.component";
import { Title } from '@angular/platform-browser';

@Component({
  /*  'app-root' automatically generated and placed into the body, its the app.component template placeholder */
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopmenuComponent, FooterComponent, LoginmodalComponent, LogoutmodalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CA_RS11_P05_Angular_ClaudiaSouza';
  constructor(private titleService: Title) {
    titleService.setTitle('H&M – Loja');
  }
}
