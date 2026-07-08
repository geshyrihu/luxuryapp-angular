import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppBarcodeScanner } from './barcode-scanner';

describe('AppBarcodeScanner', () => {
  let component: AppBarcodeScanner;
  let fixture: ComponentFixture<AppBarcodeScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBarcodeScanner],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBarcodeScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
