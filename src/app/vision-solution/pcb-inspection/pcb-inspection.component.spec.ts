import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PCBInspectionComponent } from './pcb-inspection.component';



describe('PCBInspectionComponent', () => {
  let component: PCBInspectionComponent;
  let fixture: ComponentFixture<PCBInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PCBInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PCBInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
