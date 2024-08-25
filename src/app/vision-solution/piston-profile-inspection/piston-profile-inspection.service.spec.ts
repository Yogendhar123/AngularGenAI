import { TestBed } from '@angular/core/testing';

import { PistonProfileInspectionService } from './piston-profile-inspection.service';

describe('PistonProfileInspectionService', () => {
  let service: PistonProfileInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PistonProfileInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
