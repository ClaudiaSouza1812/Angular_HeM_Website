// Import required Angular and Material modules
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import custom components and services
import { InsertuserComponent } from "./insertuser/insertuser.component";
import { IUser } from '../../../models/IUser';
import { UserService } from '../../../core/services/user.service';
import { RegistrationmodalService } from '../../../core/services/registrationmodal.service';
import { RegistrationmodalComponent } from "./registrationmodal/registrationmodal.component";
import { ListuserComponent } from "./listuser/listuser.component";
import { AutenticationService } from '../../../core/services/autentication.service';

@Component({
 selector: 'app-registration',          // Component's HTML selector
 standalone: true,                      // Marks as standalone component
 imports: [                             // Required imports for the component
   CommonModule, 
   RouterModule, 
   MatFormFieldModule, 
   MatInputModule, 
   MatSelectModule, 
   FormsModule, 
   ReactiveFormsModule, 
   InsertuserComponent, 
   RegistrationmodalComponent, 
   ListuserComponent
 ],
 templateUrl: './registration.component.html',
 styleUrl: './registration.component.css',
 changeDetection: ChangeDetectionStrategy.OnPush,  // Uses OnPush change detection for better performance
})
export class RegistrationComponent {

 // Inject required services
 constructor(
   private userService: UserService,                    // Service for user operations
   private registrationModalService: RegistrationmodalService,  // Service for modal control
   private autenticationService: AutenticationService,  // Service for authentication
   private router: Router                              // Service for navigation
 ) {}

 // Handle new user registration
 insertNewUser(newUser: IUser) {
   console.log(newUser);  // Log new user data
   // Call user service to insert new user
   this.userService.insertUser(newUser).subscribe(users => {
     console.log(users);
     // Set current user after successful registration
     this.autenticationService.setCurrentUser(newUser);
     // Show success modal
     this.registrationModalService.showModal();
   });
 }

 // Navigate to user list page
 showUserInfo() {
   this.router.navigate(['listuser']);
 }
}

