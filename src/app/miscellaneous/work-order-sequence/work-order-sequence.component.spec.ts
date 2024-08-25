import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSequenceComponent } from './work-order-sequence.component';

describe('WorkOrderSequenceComponent', () => {
  let component: WorkOrderSequenceComponent;
  let fixture: ComponentFixture<WorkOrderSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderSequenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
