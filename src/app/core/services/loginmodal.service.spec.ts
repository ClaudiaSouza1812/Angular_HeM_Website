import { TestBed } from '@angular/core/testing';

import { LoginmodalService } from './loginmodal.service';

describe('LoginmodalService', () => {
  let service: LoginmodalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginmodalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
