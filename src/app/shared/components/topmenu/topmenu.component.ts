/* libraries needed by the html template and the typescript class */
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
  /* selector to be used as an html element withim the templates */
  selector: 'app-topmenu',
  standalone: true,
  /* directives, components and pipes used withim the template (topmenu.component.html) */
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule, MatMenuTrigger],
  /* the path to show where the template and style of this component are, so them can work together */
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
/* Defines the component class that will hold all the logic, export makes it available for import in other files */
export class TopmenuComponent {

  //#region simple and decorators Properties

  /* gives access to a child element in the template; menuTrigger will reference a Material menu trigger element withim the html template; ! is the non-null assertion operator, telling TypeScript this will be initialized */
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  /* Declares an Observable that will stream user data; $ suffix is a convention for Observable variables; Can emit either an IUser object or null */
  loggedUser$!: Observable<IUser | null>;

  //#endregion


  //#region Constructor

  /* Injects three services using dependency injection; Initializes the loggedUser$ Observable from the authentication service */
  constructor(private loginModalService: LoginmodalService, private autenticationService: AutenticationService, private logoutModalService: LogoutmodalService) {
    this.loggedUser$ = this.autenticationService.currentUser$;
  }

  //#endregion

  //#region Methods

  /* Methods to control the menu's open/close state, Can be triggered by clicks or hover events, Uses the menuTrigger reference to control Material menu */
  openMenu() {
    this.menuTrigger.openMenu();
  }

  mouseEnter() {
    this.menuTrigger.openMenu();
  }

  mouseLeave() {
    this.menuTrigger.closeMenu();
  }

  /* Methods for handling user authentication; openLoginModal: Opens a login dialog; logout: Logs out the current user;openLogoutModal: Opens a logout confirmation dialog */
  openLoginModal() {
    console.log('openLoginModal Button clicked');
    this.loginModalService.showModal();
  }
  openLogoutModal() {
    console.log('openLogoutModal Button clicked');
    this.logoutModalService.showModal();
  }
  logout() {
    this.autenticationService.logout();
  }

  //#endregion
  
}
