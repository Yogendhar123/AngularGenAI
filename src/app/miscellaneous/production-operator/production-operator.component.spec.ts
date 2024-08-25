import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOperatorComponent } from './production-operator.component';

describe('ProductionOperatorComponent', () => {
  let component: ProductionOperatorComponent;
  let fixture: ComponentFixture<ProductionOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
