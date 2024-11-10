import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InsertuserComponent } from "./insertuser/insertuser.component";
import { IUser } from '../../../models/IUser';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, InsertuserComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {

  users! : IUser[];

  constructor(private userService : UserService, private router: Router) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    // this.users = this.usersservice.getAll();
    this.userService.getAllUsers().subscribe({
      next: users => {
      // console.log(users);
      this.users = users;
      },
      error: (error) => alert(error),
      complete: () => console.log("terminado")
    })
  }

  insertNewUser(newUser: IUser) {
    console.log(newUser);
    this.userService.insertUser(newUser).subscribe(users => {
      console.log(users);
      this.users = users;
    });
    // this.loadAllUsers();
  }

  searchUsers(searchValue: string) {
    // this.users = this.usersservice.searchUsers(searchValue);
    this.userService.searchUsers(searchValue).subscribe(users => {
      // console.log(users);
      this.users = users;
    })
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(users => {
      // console.log(users);
      this.users = users;
    })
  }

  showInfo(id: number) {
    console.log();
    this.router.navigate(['users', id]);
  }


}

