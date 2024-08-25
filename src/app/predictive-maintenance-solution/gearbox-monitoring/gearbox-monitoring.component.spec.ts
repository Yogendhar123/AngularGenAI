import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearboxMonitoringComponent } from './gearbox-monitoring.component';

describe('GearboxMonitoringComponent', () => {
  let component: GearboxMonitoringComponent;
  let fixture: ComponentFixture<GearboxMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearboxMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GearboxMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
