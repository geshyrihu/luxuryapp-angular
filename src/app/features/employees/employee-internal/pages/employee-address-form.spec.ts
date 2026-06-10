import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeeAddressForm } from './employee-address-form';

describe('EmployeeAddressForm', () => {
  let fixture: ComponentFixture<EmployeeAddressForm>;
  let component: EmployeeAddressForm;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue({ id: 'addr-1', city: 'Test City' }),
    onPut: vi.fn().mockResolvedValue(true),
    validateForm: vi.fn().mockReturnValue(true),
  };

  const mockAuthS = {};

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeAddressForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeAddressForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(EmployeeAddressForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('employeeId', 'emp-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.submitting()).toBe(false);
  });

  it('should load address data on init', () => {
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it('should call onPut on onSubmit when form is valid', () => {
    component.onSubmit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPut).toHaveBeenCalled();
  });
});
