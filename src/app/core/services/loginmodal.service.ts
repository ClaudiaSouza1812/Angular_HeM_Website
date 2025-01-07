/* marks this class as a service that can be injected into components */
import { Injectable } from '@angular/core';
/* is a type of Observable from RxJS that requires an initial value and stores the current value */
import { BehaviorSubject } from 'rxjs';

/* The @Injectable decorator, This makes the service available throughout the entire application as a singleton (only one instance exists). */
@Injectable({
  providedIn: 'root'
})
export class LoginmodalService {

  //#region Properties

  // Private BehaviorSubject: emit the modal visibility, "source of truth" for the modal's state that starts with false (modal hidden), can both emit and receive values
  private modalIsVisible = new BehaviorSubject<boolean>(false);

  // the observable that will update all subscribers about this modal visibility
  // Public Observable - is a public Observable that components can subscribe to (the $ suffix is a convention for Observables)
  // This pattern follows the principle of encapsulation - components can observe the state but can't directly modify it so only the service can modify its value using .next()
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
