import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppReceiptScanner } from './receipt-scanner';

describe('AppReceiptScanner', () => {
  let component: AppReceiptScanner;
  let fixture: ComponentFixture<AppReceiptScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppReceiptScanner],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppReceiptScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
