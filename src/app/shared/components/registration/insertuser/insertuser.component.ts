// Import necessary Angular and Material modules
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom} from 'rxjs';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../../models/IUser';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-insertuser',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './insertuser.component.html',
  styleUrl: './insertuser.component.css'
})
export class InsertuserComponent {
  // Output event emitter for new user data
  @Output() newUser = new EventEmitter<IUser>;

  // Signals for error messages
  nomeErrorMessage = signal('');
  moradaErrorMessage = signal('');
  emailErrorMessage = signal('');
  postalErrorMessage = signal('');
  senhaErrorMessage = signal('');

  // Signal for input value
  protected readonly value = signal('');

  // Handle input changes
  protected onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
  }

  // Form group declaration
  userForm: FormGroup;

  // Initialize form with validators
  constructor(fb: FormBuilder, private userService: UserService) {
    this.userForm = fb.group({
      nome: ['', Validators.required],
      morada: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}$')]],
      senha: ['', [
        Validators.required, 
        // Password must have uppercase, lowercase, number, special char, and min 8 chars
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$')
      ]],
      pais: ['portugal', Validators.required]
    });
  }

  // Update error messages based on validation state
  updateErrorMessage(item: AbstractControl | null, fieldName: string) {
    if (!item) return;
    
    // Select appropriate error signal based on field name
    let errorSignal: ReturnType<typeof signal<string>>;
    
    switch (fieldName) {
      case 'Nome':
        errorSignal = this.nomeErrorMessage;
        break;
      case 'Morada':
        errorSignal = this.moradaErrorMessage;
        break;
      case 'Email':
        errorSignal = this.emailErrorMessage;
        break;
      case 'Código Postal':
        errorSignal = this.postalErrorMessage;
        break;
      case 'Senha':
        errorSignal = this.senhaErrorMessage;
        break;
      default:
        return;
    }

    // Set appropriate error message based on validation error
    if (item.hasError('required')) {
      errorSignal.set(`${fieldName} é obrigatório`);
    } else if (item.hasError('email')) {
      errorSignal.set('Email inválido');
    } else if (item.hasError('pattern')) {
      switch (fieldName) {
        case 'Código Postal':
          errorSignal.set('Código Postal inválido (0000-000)');
          break;
        case 'Senha':
          errorSignal.set('A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo');
          break;
        default:
          errorSignal.set('Formato inválido');
      }
    } else {
      errorSignal.set('');
    }
  }

  // Handle user insertion
  async insertUser() {
    // Check form validity
    if (this.userForm.invalid) {
      alert("O formulário é inválido");
      return;
    }
  
    const email = this.userForm.get('email')?.value;
    
    try {
      // Check if email already exists
      const emailExists = await firstValueFrom(this.userService.checkIfEmailExists(email));
      
      if (emailExists) {
        alert('Este email já está cadastrado');
        return;
      }
      
      // Emit new user data and reset form
      this.newUser.emit(this.userForm.value);
      this.userForm.reset();
    } catch (error) {
      console.error('Error checking email:', error);
      alert('Erro ao verificar email');
    }
  }
}
