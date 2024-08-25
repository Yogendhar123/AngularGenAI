import { TestBed } from '@angular/core/testing';

import { PowmanService } from './powman.service';

describe('PowmanService', () => {
  let service: PowmanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowmanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
