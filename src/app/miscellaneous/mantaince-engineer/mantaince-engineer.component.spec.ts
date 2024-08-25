import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantainceEngineerComponent } from './mantaince-engineer.component';

describe('MantainceEngineerComponent', () => {
  let component: MantainceEngineerComponent;
  let fixture: ComponentFixture<MantainceEngineerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantainceEngineerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantainceEngineerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
