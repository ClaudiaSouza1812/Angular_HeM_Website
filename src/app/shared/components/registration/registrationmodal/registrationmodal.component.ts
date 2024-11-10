import { Component } from '@angular/core';
import { RegistrationmodalService } from '../../../../core/services/registrationmodal.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrationmodal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registrationmodal.component.html',
  styleUrl: './registrationmodal.component.css'
})
export class RegistrationmodalComponent {

  isVisible$;

  constructor(private modalService: RegistrationmodalService) {
    this.isVisible$ = this.modalService.isVisible$;
  }

  ngOnInit() {}

  closeModal() {
    this.modalService.hideModal();
  }

}
