import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppBarcodeInput } from './barcode-input';

describe('AppBarcodeInput', () => {
  let component: AppBarcodeInput;
  let fixture: ComponentFixture<AppBarcodeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBarcodeInput],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBarcodeInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
