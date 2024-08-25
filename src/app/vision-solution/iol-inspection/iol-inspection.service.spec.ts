import { TestBed } from '@angular/core/testing';
import { IOLInspectionService } from './iol-inspection.service';

describe('IOLInspectionService', () => {
  let service: IOLInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IOLInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
