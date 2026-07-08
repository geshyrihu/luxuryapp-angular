import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconSendEmail } from './button-send-email';

describe('WebButtonIconSendEmail', () => {
  let component: WebButtonIconSendEmail;
  let fixture: ComponentFixture<WebButtonIconSendEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconSendEmail],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconSendEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
