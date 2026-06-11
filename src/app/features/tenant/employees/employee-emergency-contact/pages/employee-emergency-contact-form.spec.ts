import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { EmployeeEmergencyContactForm } from './employee-emergency-contact-form';

describe('EmployeeEmergencyContactForm', () => {
  let fixture: ComponentFixture<EmployeeEmergencyContactForm>;
  let component: EmployeeEmergencyContactForm;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  const mockEnumSelectS = {
    relationEmployee: vi.fn().mockReturnValue(of([{ value: 1, label: 'Relative' }])),
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeEmergencyContactForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeEmergencyContactForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: DynamicDialogConfig, useValue: { data: { id: 'test-id', employeeId: 'emp-1', contacOfBeneficiary: 0 } } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(EmployeeEmergencyContactForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.submitting()).toBe(false);
  });

  it('should initialize id from config data', () => {
    expect(component.id).toBe('test-id');
  });

  it('should initialize form with config data', () => {
    expect(component.form.controls.employeeId.value).toBe('emp-1');
  });
});
