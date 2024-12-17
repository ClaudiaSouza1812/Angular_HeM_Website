// Import required Angular modules and services
import { Component } from '@angular/core';
import { RegistrationmodalService } from '../../../../core/services/registrationmodal.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrationmodal',     // Component's HTML selector
  standalone: true,                      // Marks as standalone component
  imports: [CommonModule, RouterModule],  // Required imports for common directives and routing
  templateUrl: './registrationmodal.component.html',
  styleUrl: './registrationmodal.component.css'
})
export class RegistrationmodalComponent {

  // Property to track modal visibility state
  // Connects to service's Observable
  isVisible$;

  // Inject modal service and initialize visibility state
  constructor(private modalService: RegistrationmodalService) {
    // Subscribe to service's visibility Observable
    this.isVisible$ = this.modalService.isVisible$;
  }

  // Lifecycle hook - currently empty but available for future use
  ngOnInit() {}

  // Method to close the modal
  // Calls service method to update visibility state
  closeModal() {
    this.modalService.hideModal();
  }
}
