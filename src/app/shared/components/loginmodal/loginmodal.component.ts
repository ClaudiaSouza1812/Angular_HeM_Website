// Import necessary Angular and form-related modules
import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginmodalService } from '../../../core/services/loginmodal.service';
import { AutenticationService } from '../../../core/services/autentication.service';

// Component decorator defining metadata about this component
// standalone: true means it manages its own dependencies
// imports: array of modules this component needs
@Component({
  selector: 'app-loginmodal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loginmodal.component.html',
  styleUrl: './loginmodal.component.css'
})
export class LoginmodalComponent {
  // Form group instance to manage the login form
  // Will contain email and password controls
  modalForm: FormGroup;

  // Tracks whether the modal is currently visible
  // Updated through subscription to LoginmodalService
  isVisible: boolean = false;

  // Properties to store current validation messages
  // These will be displayed in the template
  currentEmailMessage: string = '';
  currentPasswordMessage: string = '';

  // Object containing all possible error messages
  // Centralizes error message management
  errorMessages = {
    emailMessage: "O 'email' tem um formato incorrecto!",
    passwordMessage: "Os dois campos são de preenchimento obrigatório.",
    unknownUserMessage: "Utilizador inexistente!"
  }

  // Constructor injects required services and sets up the form
  constructor(private fb: FormBuilder, private loginModalService: LoginmodalService, private autenticationService: AutenticationService) {

    console.log('Modal component initialized');

    // Initialize form with validation rules
    this.modalForm = fb.group({
      emailInput: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')]],
      passwordInput: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]]
    })

  }

  // Subscribe to modal visibility changes when component initializes
  ngOnInit() {
    this.loginModalService.isVisible$.subscribe(value => this.isVisible = value);
  }

  // Handles modal closure
  // Resets form and error messages
  closeModal() {
    this.modalForm.reset();
    this.currentEmailMessage = '';
    this.currentPasswordMessage = '';
    this.loginModalService.hideModal();
  }

  // Shows appropriate error message based on input validation
  // input parameter determines which field's errors to show
  showErrorMessage(input: string) {
    this.currentEmailMessage = '';
    this.currentPasswordMessage = '';
    const emailControl = this.modalForm.get('emailInput');
    const passwordControl = this.modalForm.get('passwordInput');
    
    if (input === 'email') {
      if (emailControl?.invalid) {
        this.currentEmailMessage = this.errorMessages.emailMessage;
      } 
    }

    if (input === 'password' && passwordControl?.invalid) {
      this.currentPasswordMessage = this.errorMessages.passwordMessage;
    }
  }

  // Validates user credentials against the authentication service
  // Called when form is submitted
  validateUser() {
    const emailInput = this.modalForm.get('emailInput');
    const passwordInput = this.modalForm.get('passwordInput');

    // Only proceed if both fields are valid
    if (emailInput?.valid && passwordInput?.valid) {
      const email = emailInput.value;
      const password = passwordInput.value;
  
      // Attempt to authenticate user
      this.autenticationService.getUser(email, password).subscribe({
        next: (user) => {
          if (user) {
            // User found - close modal
            console.log('User found:', user);
            this.closeModal();
          } else {
            // User not found - show error
            this.currentEmailMessage = this.errorMessages.unknownUserMessage;
          }
        },
        error: (error) => {
          console.error('Authentication error:', error);
        }
      });
    }
  }
}
