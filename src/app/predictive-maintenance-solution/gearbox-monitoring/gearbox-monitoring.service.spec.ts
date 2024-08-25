import { TestBed } from '@angular/core/testing';

import { GearboxMonitoringService } from './gearbox-monitoring.service';

describe('GearboxMonitoringService', () => {
  let service: GearboxMonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GearboxMonitoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
