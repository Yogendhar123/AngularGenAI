import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveMaintenanceHomeComponent } from './predictive-maintenance-home.component';

describe('PredictiveMaintenanceHomeComponent', () => {
  let component: PredictiveMaintenanceHomeComponent;
  let fixture: ComponentFixture<PredictiveMaintenanceHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictiveMaintenanceHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveMaintenanceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
