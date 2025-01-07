// Import necessary modules and components from Angular
import { CommonModule } from '@angular/common';  // Provides common Angular directives and pipes
import { Component } from '@angular/core';       // Core Angular decorator and functionality

// Import custom services used by this component
import { LogoutmodalService } from '../../../core/services/logoutmodal.service';      // Service to manage modal visibility
import { AutenticationService } from '../../../core/services/autentication.service';   // Service to handle authentication

// Component decorator that defines component metadata
@Component({
  selector: 'app-logoutmodal',      // HTML selector used to embed this component
  standalone: true,                 // Indicates this is a standalone component (new Angular feature)
  imports: [CommonModule],          // Required imports for this standalone component
  templateUrl: './logoutmodal.component.html',   // Path to the HTML template file
  styleUrl: './logoutmodal.component.css'        // Path to the CSS styles file
})
export class LogoutmodalComponent {
  // Class property to track modal visibility state
  isVisible: boolean = false;

  // Constructor with dependency injection of required services
  constructor(
    private logoutModalService: LogoutmodalService,      // Service for modal state management
    private autenticationService: AutenticationService    // Service for authentication operations
  ) {
    // Subscribe to the modal service's visibility observable
    // Updates local isVisible property whenever the service's state changes
    this.logoutModalService.isVisible$.subscribe(value => this.isVisible = value)
  }

  // Method to close the modal
  // Calls the service's hideModal method to update the visibility state
  closeModal() {
    this.logoutModalService.hideModal();
  }

  // Method to handle user logout
  // 1. Calls authentication service to logout
  // 2. Closes the modal after logout
  logoutUser() {
    this.autenticationService.logout();
    this.closeModal();
  }

}
