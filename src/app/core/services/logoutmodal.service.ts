import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutmodalService {

  private modalIsVisible = new BehaviorSubject<boolean>(false);
  
  public isVisible$ = this.modalIsVisible.asObservable();

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
