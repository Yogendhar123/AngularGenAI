import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvectionOvenComponent } from './convection-oven.component';


describe('ReflowOvenComponent', () => {
  let component: ConvectionOvenComponent;
  let fixture: ComponentFixture<ConvectionOvenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvectionOvenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvectionOvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
