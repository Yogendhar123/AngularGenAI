import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteelSurfaceInspectionComponent } from './steel-surface-inspection.component';

describe('SteelSurfaceInspectionComponent', () => {
  let component: SteelSurfaceInspectionComponent;
  let fixture: ComponentFixture<SteelSurfaceInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SteelSurfaceInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelSurfaceInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
