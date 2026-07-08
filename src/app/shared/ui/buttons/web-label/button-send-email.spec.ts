import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelSendEmail } from './button-send-email';

describe('WebButtonLabelSendEmail', () => {
  let component: WebButtonLabelSendEmail;
  let fixture: ComponentFixture<WebButtonLabelSendEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelSendEmail],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelSendEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
