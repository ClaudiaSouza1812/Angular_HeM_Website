import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogoutmodalService } from '../../../core/services/logoutmodal.service';
import { AutenticationService } from '../../../core/services/autentication.service';

@Component({
  selector: 'app-logoutmodal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logoutmodal.component.html',
  styleUrl: './logoutmodal.component.css'
})
export class LogoutmodalComponent {

  isVisible: boolean = false;

  constructor(private logoutModalService: LogoutmodalService, private autenticationService: AutenticationService) {
    this.logoutModalService.isVisible$.subscribe(value => this.isVisible = value)
  }

  closeModal() {
    this.logoutModalService.hideModal();
  }

  logoutUser() {
    this.autenticationService.logout();
    this.closeModal();
  }
}
