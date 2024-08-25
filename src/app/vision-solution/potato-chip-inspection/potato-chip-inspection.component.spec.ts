import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotatoChipInspectionComponent } from './potato-chip-inspection.component';

describe('PotatoChipInspectionComponent', () => {
  let component: PotatoChipInspectionComponent;
  let fixture: ComponentFixture<PotatoChipInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotatoChipInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PotatoChipInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
