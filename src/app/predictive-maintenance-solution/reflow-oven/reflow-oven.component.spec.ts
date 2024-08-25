import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflowOvenComponent } from './reflow-oven.component';

describe('ReflowOvenComponent', () => {
  let component: ReflowOvenComponent;
  let fixture: ComponentFixture<ReflowOvenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReflowOvenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReflowOvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
