import { TestBed } from '@angular/core/testing';

import { LogoutmodalService } from './logoutmodal.service';

describe('LogoutmodalService', () => {
  let service: LogoutmodalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutmodalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
