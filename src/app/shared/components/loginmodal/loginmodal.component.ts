import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginmodalService } from '../../../core/services/loginmodal.service';

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
    emailMessage: "O campo 'email' é de preenchimento obrigatório.",
    passwordMessage: "O campo 'senha' é de preenchimento obrigatório."
  }

  constructor(private fb: FormBuilder, public loginModalService: LoginmodalService) {
    console.log('Modal component initialized');
    this.modalForm = fb.group({
      emailInput: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')]],
      passwordInput: ['', [Validators.required], Validators.minLength(6), Validators.maxLength(10)]
    })
  }

  // subscribe the value of isVisible$ to isVisible to show the current visibility of the modal to this class
  ngOnInit() {
    this.loginModalService.isVisible$.subscribe(value => this.isVisible = value);
  }

  closeModal() {
    this.loginModalService.hideModal();
  }

  showErrorMessage(input: string) {
    const emailControl = this.modalForm.get('emailInput');
    const passwordControl = this.modalForm.get('passwordInput');
    
    if (input === 'email' && emailControl?.invalid) {
      this.currentEmailMessage = this.errorMessages.emailMessage;
    } else {
      this.currentEmailMessage = '';
    }

    if (input === 'password' && passwordControl?.invalid) {
      this.currentPasswordMessage = this.errorMessages.passwordMessage;
    } else {
      this.currentPasswordMessage = '';
    }

  }

  validateUser() {
    const emailInput = this.modalForm.get('emailInput');
    const passwordInput = this.modalForm.get('passwordInput');

    if (emailInput?.valid && passwordInput?.valid) {
      
    }
  }
  
}
