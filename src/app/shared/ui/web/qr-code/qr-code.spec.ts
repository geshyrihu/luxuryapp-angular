import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppQrCode } from './qr-code';

describe('AppQrCode', () => {
  let component: AppQrCode;
  let fixture: ComponentFixture<AppQrCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppQrCode],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppQrCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
