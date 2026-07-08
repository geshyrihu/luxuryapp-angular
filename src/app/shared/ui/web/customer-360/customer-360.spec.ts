import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppCustomer360 } from './customer-360';

describe('AppCustomer360', () => {
  let component: AppCustomer360;
  let fixture: ComponentFixture<AppCustomer360>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCustomer360],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppCustomer360);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
