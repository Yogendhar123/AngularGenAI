import { TestBed } from '@angular/core/testing';

import { ReflowOvenService } from './reflow-oven.service';

describe('ReflowOvenService', () => {
  let service: ReflowOvenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReflowOvenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
