import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainAssistanceComponent } from './supply-chain-assistance.component';

describe('SupplyChainAssistanceComponent', () => {
  let component: SupplyChainAssistanceComponent;
  let fixture: ComponentFixture<SupplyChainAssistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyChainAssistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
