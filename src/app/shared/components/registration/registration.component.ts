import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InsertuserComponent } from "./insertuser/insertuser.component";
import { IUser } from '../../../models/IUser';
import { UserService } from '../../../core/services/user.service';
import { RegistrationmodalService } from '../../../core/services/registrationmodal.service';
import { RegistrationmodalComponent } from "./registrationmodal/registrationmodal.component";
import { ListuserComponent } from "./listuser/listuser.component";
import { AutenticationService } from '../../../core/services/autentication.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, InsertuserComponent, RegistrationmodalComponent, ListuserComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {

  constructor(private userService : UserService, private registrationModalService: RegistrationmodalService, private autenticationService: AutenticationService, private router: Router) {}

  insertNewUser(newUser: IUser) {
    console.log(newUser);
    this.userService.insertUser(newUser).subscribe(users => {
      console.log(users);
      this.autenticationService.setCurrentUser(newUser);
      this.registrationModalService.showModal();
    });
  }

  showUserInfo() {
    this.router.navigate(['listuser']);
  }


}

