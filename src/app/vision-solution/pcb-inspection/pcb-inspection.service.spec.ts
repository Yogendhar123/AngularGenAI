import { TestBed } from '@angular/core/testing';
import { PCBInspectionService } from './pcb-inspection.service';

describe('PCBInspectionService', () => {
  let service: PCBInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PCBInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
