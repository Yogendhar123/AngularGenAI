import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandSupplyComponent } from './demand-supply.component';

describe('DemandSupplyComponent', () => {
  let component: DemandSupplyComponent;
  let fixture: ComponentFixture<DemandSupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandSupplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
