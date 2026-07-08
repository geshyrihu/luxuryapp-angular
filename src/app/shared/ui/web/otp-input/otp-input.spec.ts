import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppOtpInput } from './otp-input';

describe('AppOtpInput', () => {
  let component: AppOtpInput;
  let fixture: ComponentFixture<AppOtpInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppOtpInput],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppOtpInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
