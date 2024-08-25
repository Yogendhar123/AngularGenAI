import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MillingCutterRulComponent } from './milling-cutter-rul.component';

describe('MillingCutterRulComponent', () => {
  let component: MillingCutterRulComponent;
  let fixture: ComponentFixture<MillingCutterRulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MillingCutterRulComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MillingCutterRulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
