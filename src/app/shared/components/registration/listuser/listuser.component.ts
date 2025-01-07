// Import necessary Angular and RxJS dependencies
import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Import interfaces and services
import { IUser } from '../../../../models/IUser';
import { AutenticationService } from '../../../../core/services/autentication.service';

@Component({
  selector: 'app-listuser',          // Component's HTML selector
  standalone: true,                  // Marks as standalone component
  imports: [CommonModule],           // Required for common directives like *ngIf
  templateUrl: './listuser.component.html',
  styleUrl: './listuser.component.css'
})
export class ListuserComponent {
  // Observable to track current user state
  currentUser$: Observable<IUser | null>;
  
  // Inject authentication service and initialize current user Observable
  constructor(private autenticationService: AutenticationService) {
    this.currentUser$ = this.autenticationService.currentUser$;
  }
}
