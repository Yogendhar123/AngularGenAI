import { TestBed } from '@angular/core/testing';
import { ConvectionOvenComponent } from './convection-oven.component';



describe('ReflowOvenService', () => {
  let service: ConvectionOvenComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvectionOvenComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
