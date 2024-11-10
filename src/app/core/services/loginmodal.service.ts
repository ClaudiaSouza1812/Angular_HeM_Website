import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginmodalService {

  //#region Properties

  // emit the modal visibility, "source of truth" for the modal's state
  // Private BehaviorSubject - can both emit and receive values
  private modalIsVisible = new BehaviorSubject<boolean>(false);

  // the observable that will update all subscribers about this modal visibility
  // Public Observable - can only receive values, so only the service can modify values using .next()
  public isVisible$ = this.modalIsVisible.asObservable();

  //#endregion
  
  constructor() { }

  showModal() {
    console.log('Service showModal called');
    this.modalIsVisible.next(true);
    console.log('Current visibility value:', this.modalIsVisible.value);
  }

  hideModal() {
    console.log('Service hideModal called');
    this.modalIsVisible.next(false);
    console.log('Current visibility value:', this.modalIsVisible.value);
  }
}
