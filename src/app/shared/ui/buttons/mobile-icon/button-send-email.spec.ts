import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconSendEmail } from './button-send-email';

describe('MobileButtonIconSendEmail', () => {
  let component: MobileButtonIconSendEmail;
  let fixture: ComponentFixture<MobileButtonIconSendEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconSendEmail],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconSendEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
