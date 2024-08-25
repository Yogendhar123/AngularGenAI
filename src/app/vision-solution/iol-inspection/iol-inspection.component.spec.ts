import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IOLInspectionComponent } from './iol-inspection.component';

describe('PCBInspectionComponent', () => {
  let component: IOLInspectionComponent;
  let fixture: ComponentFixture<IOLInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IOLInspectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IOLInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
