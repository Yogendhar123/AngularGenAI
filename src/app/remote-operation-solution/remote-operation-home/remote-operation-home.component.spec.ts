import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteOperationHomeComponent } from './remote-operation-home.component';

describe('RemoteOperationHomeComponent', () => {
  let component: RemoteOperationHomeComponent;
  let fixture: ComponentFixture<RemoteOperationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteOperationHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteOperationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
