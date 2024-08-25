import { TestBed } from '@angular/core/testing';

import { ChangePwdService } from './change-pwd.service';

describe('ChangePwdService', () => {
  let service: ChangePwdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePwdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
