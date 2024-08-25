import { TestBed } from '@angular/core/testing';

import { FrictionStirWeldingService } from './friction-stir-welding.service';

describe('FrictionStirWeldingService', () => {
  let service: FrictionStirWeldingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrictionStirWeldingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
