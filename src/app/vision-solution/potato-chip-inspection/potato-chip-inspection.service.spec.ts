import { TestBed } from '@angular/core/testing';

import { PotatoChipInspectionService } from './potato-chip-inspection.service';

describe('PotatoChipInspectionService', () => {
  let service: PotatoChipInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotatoChipInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
