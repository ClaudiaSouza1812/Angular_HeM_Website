import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginmodalService } from '../../../core/services/loginmodal.service';
import { AutenticationService } from '../../../core/services/autentication.service';

@Component({
  selector: 'app-loginmodal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loginmodal.component.html',
  styleUrl: './loginmodal.component.css'
})
export class LoginmodalComponent {

  modalForm: FormGroup;
  isVisible: boolean = false;
  currentEmailMessage: string = '';
  currentPasswordMessage: string = '';

  errorMessages = {
    emailMessage: "O 'email' tem um formato incorrecto!",
    passwordMessage: "Os dois campos são de preenchimento obrigatório.",
    unknownUserMessage: "Utilizador inexistente!"
  }

  constructor(private fb: FormBuilder, private loginModalService: LoginmodalService, private autenticationService: AutenticationService) {

    console.log('Modal component initialized');
    this.modalForm = fb.group({
      emailInput: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')]],
      passwordInput: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]]
    })

  }

  // subscribe the value of isVisible$ to isVisible to show the current visibility of the modal to this class
  ngOnInit() {
    this.loginModalService.isVisible$.subscribe(value => this.isVisible = value);
  }

  closeModal() {
    this.modalForm.reset();
    this.currentEmailMessage = '';
    this.currentPasswordMessage = '';
    this.loginModalService.hideModal();
  }

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

  validateUser() {
    const emailInput = this.modalForm.get('emailInput');
    const passwordInput = this.modalForm.get('passwordInput');

    if (emailInput?.valid && passwordInput?.valid) {
      // Get the values from the form controls
      const email = emailInput.value;
      const password = passwordInput.value;
  
      // Subscribe to the observable returned by getUser
      this.autenticationService.getUser(email, password).subscribe({
        next: (user) => {
          if (user) {
            console.log('User found:', user);
            this.closeModal();
          } else {
            this.currentEmailMessage = this.errorMessages.unknownUserMessage;
          }
        },
        error: (error) => {
          console.error('Authentication error:', error);
          // Handle error if needed
        }
      });
    }
  }
}
