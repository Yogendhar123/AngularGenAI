import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrictionStirWeldingComponent } from './friction-stir-welding.component';

describe('FrictionStirWeldingComponent', () => {
  let component: FrictionStirWeldingComponent;
  let fixture: ComponentFixture<FrictionStirWeldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrictionStirWeldingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrictionStirWeldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
