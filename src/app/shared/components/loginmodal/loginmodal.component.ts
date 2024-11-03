import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
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

  constructor(private fb: FormBuilder, public loginModalService: LoginmodalService) {
    console.log('Modal component initialized');
    this.modalForm = fb.group({
      emailInput: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')]],
      passwordInput: ['', [Validators.required]]
    })
  }

  // Component subscribes to isVisible$
  // subscribe the value of isVisible$ to isVisible to show the current visibility of the modal to this class
  ngOnInit() {
    this.loginModalService.isVisible$.subscribe(isVisible => {
      console.log('Modal visibility changed:', isVisible);
    });
  }

  closeModal() {
    this.loginModalService.hideModal();
  }
  
}
