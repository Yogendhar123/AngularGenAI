import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FatigueInspectionComponent } from './fatigue-inspection.component';

describe('FatigueInspectionComponent', () => {
  let component: FatigueInspectionComponent;
  let fixture: ComponentFixture<FatigueInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FatigueInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FatigueInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
