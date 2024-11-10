import { Component, ViewChild} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LoginmodalService } from '../../../core/services/loginmodal.service';
import { AutenticationService } from '../../../core/services/autentication.service';
import { IUser } from '../../../models/IUser';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LogoutmodalService } from '../../../core/services/logoutmodal.service';

@Component({
  selector: 'app-topmenu',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule, MatMenuTrigger],
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent {

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  loggedUser$!: Observable<IUser | null>;

  constructor(private loginModalService: LoginmodalService, private autenticationService: AutenticationService, private logoutModalService: LogoutmodalService) {
    this.loggedUser$ = this.autenticationService.currentUser$;
  }

  openMenu() {
    this.menuTrigger.openMenu();
  }

  mouseEnter() {
    this.menuTrigger.openMenu();
  }

  mouseLeave() {
    this.menuTrigger.closeMenu();
  }

  openLoginModal() {
    console.log('openLoginModal Button clicked');
    this.loginModalService.showModal();
  }

  logout() {
    this.autenticationService.logout();
  }

  openLogoutModal() {
    console.log('openLogoutModal Button clicked');
    this.logoutModalService.showModal();
  }
}
