import { TestBed } from '@angular/core/testing';

import { SteelSurfaceInspectionService } from './steel-surface-inspection.service';

describe('SteelSurfaceInspectionService', () => {
  let service: SteelSurfaceInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteelSurfaceInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
