import { TestBed } from '@angular/core/testing';

import { CopperServiceService } from './copper-service.service';

describe('CopperServiceService', () => {
  let service: CopperServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopperServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
