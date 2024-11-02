import { Component } from '@angular/core';
import { TopmenuComponent } from "./topmenu/topmenu.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TopmenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
