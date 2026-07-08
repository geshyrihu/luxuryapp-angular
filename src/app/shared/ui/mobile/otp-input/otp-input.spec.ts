import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileOtpInput } from './otp-input';

describe('MobileOtpInput', () => {
  let component: MobileOtpInput;
  let fixture: ComponentFixture<MobileOtpInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileOtpInput],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileOtpInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
