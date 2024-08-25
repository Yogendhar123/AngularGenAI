import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousHomeComponent } from './miscellaneous-home.component';

describe('MiscellaneousHomeComponent', () => {
  let component: MiscellaneousHomeComponent;
  let fixture: ComponentFixture<MiscellaneousHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
