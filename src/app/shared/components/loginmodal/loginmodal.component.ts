import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-loginmodal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loginmodal.component.html',
  styleUrl: './loginmodal.component.css'
})
export class LoginmodalComponent {

  modalForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.modalForm = fb.group({
      emailInput: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')]],
      passwordInput: ['', [Validators.required]]
    })
  }

  showLoginModal(): void {
    this.modalForm
  }
}
