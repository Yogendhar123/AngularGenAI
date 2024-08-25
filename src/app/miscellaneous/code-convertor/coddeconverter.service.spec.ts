import { TestBed } from '@angular/core/testing';

import { CoddeconverterService } from './coddeconverter.service';

describe('CoddeconverterService', () => {
  let service: CoddeconverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoddeconverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
