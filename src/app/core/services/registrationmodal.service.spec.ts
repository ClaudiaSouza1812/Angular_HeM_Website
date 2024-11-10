import { TestBed } from '@angular/core/testing';

import { RegistrationmodalService } from './registrationmodal.service';

describe('RegistrationmodalService', () => {
  let service: RegistrationmodalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationmodalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
