import { TestBed } from '@angular/core/testing';

import { BoostService } from './boost.service';

describe('BoostService', () => {
  let service: BoostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
