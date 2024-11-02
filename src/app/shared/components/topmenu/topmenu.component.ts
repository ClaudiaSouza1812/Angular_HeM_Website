import { Component, ViewChild} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topmenu',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule, MatMenuTrigger],
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent {

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  
  openMenu() {
    this.menuTrigger.openMenu();
  }

  mouseEnter() {
    this.menuTrigger.openMenu();
  }

  mouseLeave() {
    this.menuTrigger.closeMenu();
  }
}
