import { TestBed } from '@angular/core/testing';

import { FatigueSService } from './fatigue-s.service';

describe('FatigueSService', () => {
  let service: FatigueSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FatigueSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
