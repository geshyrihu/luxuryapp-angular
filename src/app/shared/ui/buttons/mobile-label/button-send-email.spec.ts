import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelSendEmail } from './button-send-email';

describe('MobileButtonLabelSendEmail', () => {
  let component: MobileButtonLabelSendEmail;
  let fixture: ComponentFixture<MobileButtonLabelSendEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelSendEmail],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelSendEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
