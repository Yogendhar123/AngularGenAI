import { TestBed } from '@angular/core/testing';

import { ControlPumpService } from './control-pump.service';

describe('ControlPumpService', () => {
  let service: ControlPumpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlPumpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
