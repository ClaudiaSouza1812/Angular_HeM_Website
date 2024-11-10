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

  @Output() newUser = new EventEmitter<IUser>;

  nomeErrorMessage = signal('');
  moradaErrorMessage = signal('');
  emailErrorMessage = signal('');
  postalErrorMessage = signal('');
  senhaErrorMessage = signal('');

  protected readonly value = signal('');
  

  protected onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
  }

  userForm: FormGroup;

  constructor(fb: FormBuilder, private userService: UserService) {
    this.userForm = fb.group({
      nome: ['', Validators.required],
      morada: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}$')]],
      senha: ['', [
        Validators.required, 
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$')
      ]],
      pais: ['portugal', Validators.required]
    });
  }

  
  updateErrorMessage(item: AbstractControl | null, fieldName: string) {
    if (!item) return;
    
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

  async insertUser() {
    if (this.userForm.invalid) {
      alert("O formulário é inválido");
      return;
    }
  
    const email = this.userForm.get('email')?.value;
    
    try {
      const emailExists = await firstValueFrom(this.userService.checkIfEmailExists(email));
      
      if (emailExists) {
        alert('Este email já está cadastrado');
        return;
      }
      
      this.newUser.emit(this.userForm.value);
      this.userForm.reset();
    } catch (error) {
      console.error('Error checking email:', error);
      alert('Erro ao verificar email');
    }
  }

}
