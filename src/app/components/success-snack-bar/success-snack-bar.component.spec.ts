import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSnackBarComponent } from './success-snack-bar.component';

describe('SuccessSnackBarComponent', () => {
  let component: SuccessSnackBarComponent;
  let fixture: ComponentFixture<SuccessSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessSnackBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
