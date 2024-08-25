import { TestBed } from '@angular/core/testing';

import { MillingCutterRulService } from './milling-cutter-rul.service';

describe('MillingCutterRulService', () => {
  let service: MillingCutterRulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MillingCutterRulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
