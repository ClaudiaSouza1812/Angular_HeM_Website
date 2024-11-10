import { Component, Input, Output } from '@angular/core';
import { IUser } from '../../../../models/IUser';
import { AutenticationService } from '../../../../core/services/autentication.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listuser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listuser.component.html',
  styleUrl: './listuser.component.css'
})
export class ListuserComponent {

  currentUser$: Observable<IUser | null>;
  
  constructor(private autenticationService: AutenticationService) {
    this.currentUser$ = this.autenticationService.currentUser$;
  }

}
