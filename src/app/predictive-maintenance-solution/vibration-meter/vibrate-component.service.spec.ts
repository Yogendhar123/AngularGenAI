import { TestBed } from '@angular/core/testing';

import { VibrateComponentService } from './vibrate-component.service';

describe('VibrateComponentService', () => {
  let service: VibrateComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VibrateComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
