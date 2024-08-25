import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowmanComponent } from './powman.component';

describe('PowmanComponent', () => {
  let component: PowmanComponent;
  let fixture: ComponentFixture<PowmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowmanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
