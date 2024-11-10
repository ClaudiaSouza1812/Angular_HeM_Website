import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationmodalComponent } from './registrationmodal.component';

describe('RegistrationmodalComponent', () => {
  let component: RegistrationmodalComponent;
  let fixture: ComponentFixture<RegistrationmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
