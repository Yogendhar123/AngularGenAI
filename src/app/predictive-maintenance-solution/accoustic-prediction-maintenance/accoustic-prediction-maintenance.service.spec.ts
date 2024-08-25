import { TestBed } from '@angular/core/testing';

import { AccousticPredictionMaintenanceService } from './accoustic-prediction-maintenance.service';

describe('AccousticPredictionMaintenanceService', () => {
  let service: AccousticPredictionMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccousticPredictionMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
