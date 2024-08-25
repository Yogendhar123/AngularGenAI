import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPumpComponent } from './control-pump.component';

describe('ControlPumpComponent', () => {
  let component: ControlPumpComponent;
  let fixture: ComponentFixture<ControlPumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlPumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
