import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PistonProfileInspectionComponent } from './piston-profile-inspection.component';

describe('PistonProfileInspectionComponent', () => {
  let component: PistonProfileInspectionComponent;
  let fixture: ComponentFixture<PistonProfileInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PistonProfileInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PistonProfileInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
