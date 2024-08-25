import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccousticPredictionMaintenanceComponent } from './accoustic-prediction-maintenance.component';

describe('AccousticPredictionMaintenanceComponent', () => {
  let component: AccousticPredictionMaintenanceComponent;
  let fixture: ComponentFixture<AccousticPredictionMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccousticPredictionMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccousticPredictionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
