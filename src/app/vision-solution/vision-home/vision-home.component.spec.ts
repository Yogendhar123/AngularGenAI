import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionHomeComponent } from './vision-home.component';

describe('VisionHomeComponent', () => {
  let component: VisionHomeComponent;
  let fixture: ComponentFixture<VisionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisionHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
