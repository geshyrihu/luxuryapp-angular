import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { CustomerLocationForm } from './customer-location-form';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { FormHelper } from 'src/app/core/helpers/form-helper';
import { EndpointsAdmin } from 'src/app/core/constants/endpoints/admin.endpoints';
import { CustomerLocationType, CustomerLocationTypeOptions } from './interfaces/customer-location-type.enum';
import { CustomerLocationAddOrEditDto } from './interfaces/customer-location-add-or-edit.dto';

describe('CustomerLocationForm', () => {
  let component: CustomerLocationForm;
  let fixture: ComponentFixture<CustomerLocationForm>;

  const mockDialogRef = {
    close: vi.fn(),
  };

  const mockDialogConfig = {
    data: { customerId: 'cust-1', id: '' },
  };

  const mockApiResponseService = {
    validateForm: vi.fn().mockReturnValue(true),
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  const mockFormHelper = {
    submitCrud: vi.fn(),
  };

  const mockEndpoints = {
    CustomerLocations: {
      getById: vi.fn().mockReturnValue('api/customer-locations/id'),
      create: 'api/customer-locations',
      update: vi.fn().mockReturnValue('api/customer-locations/id'),
    },
  };

  beforeEach(() => {
    TestBed.overrideComponent(CustomerLocationForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [CustomerLocationForm, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: FormHelper, useValue: mockFormHelper },
        { provide: EndpointsAdmin, useValue: mockEndpoints },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomerLocationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls.customerId.value).toBe('');
    expect(component.form.controls.name.value).toBe('');
    expect(component.form.controls.locationType.value).toBe('');
    expect(component.form.controls.phoneOne.value).toBe('');
    expect(component.form.controls.phoneTwo.value).toBeNull();
    expect(component.form.controls.contactName.value).toBeNull();
    expect(component.form.controls.notes.value).toBeNull();
    expect(component.form.controls.sortOrder.value).toBe(0);
    expect(component.form.controls.isActive.value).toBeTrue();
  });

  it('should have required validators on required fields', () => {
    const requiredFields = ['customerId', 'name', 'locationType', 'phoneOne'];
    requiredFields.forEach((field) => {
      const control = component.form.controls[field];
      expect(control.hasError('required')).toBeTrue();
    });
  });

  it('should have maxLength validators', () => {
    component.form.controls.name.setValue('a'.repeat(101));
    expect(component.form.controls.name.hasError('maxlength')).toBeTrue();

    component.form.controls.phoneOne.setValue('1'.repeat(16));
    expect(component.form.controls.phoneOne.hasError('maxlength')).toBeTrue();

    component.form.controls.contactName.setValue('a'.repeat(101));
    expect(component.form.controls.contactName.hasError('maxlength')).toBeTrue();

    component.form.controls.notes.setValue('a'.repeat(501));
    expect(component.form.controls.notes.hasError('maxlength')).toBeTrue();
  });

  it('should have min validator on sortOrder', () => {
    component.form.controls.sortOrder.setValue(-1);
    expect(component.form.controls.sortOrder.hasError('min')).toBeTrue();

    component.form.controls.sortOrder.setValue(0);
    expect(component.form.controls.sortOrder.hasError('min')).toBeFalse();
  });

  it('should populate locationTypeOptions from enum', () => {
    expect(component.locationTypeOptions.length).toBe(CustomerLocationTypeOptions.length);
    expect(component.locationTypeOptions[0]).toEqual({
      value: CustomerLocationTypeOptions[0].value,
      label: CustomerLocationTypeOptions[0].label,
    });
  });

  describe('ngOnInit', () => {
    it('should set customerId from config data', () => {
      expect(component.customerId).toBe('cust-1');
      expect(component.form.controls.customerId.value).toBe('cust-1');
    });

    it('should call onLoadData when id is provided', () => {
      const configWithId = { data: { customerId: 'cust-1', id: 'loc-1' } };
      
      TestBed.resetTestingModule();
      TestBed.overrideComponent(CustomerLocationForm, {
        set: { template: '<div>Mock</div>', imports: [] },
      });

      TestBed.configureTestingModule({
        imports: [CustomerLocationForm, NoopAnimationsModule, ReactiveFormsModule],
        providers: [
          { provide: DynamicDialogRef, useValue: mockDialogRef },
          { provide: DynamicDialogConfig, useValue: configWithId },
          { provide: ApiResponseService, useValue: mockApiResponseService },
          { provide: FormHelper, useValue: mockFormHelper },
          { provide: EndpointsAdmin, useValue: mockEndpoints },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });

      const fixture2 = TestBed.createComponent(CustomerLocationForm);
      fixture2.detectChanges();

      expect(mockApiResponseService.onGetItem).toHaveBeenCalledWith(
        'api/customer-locations/loc-1'
      );
    });
  });

  describe('onLoadData', () => {
    it('should patch form with loaded data', async () => {
      const mockDto: CustomerLocationAddOrEditDto = {
        id: 'loc-1',
        customerId: 'cust-1',
        name: 'Test Location',
        locationType: CustomerLocationType.MainGate,
        phoneOne: '5512345678',
        phoneTwo: '5512345679',
        contactName: 'John Doe',
        notes: 'Test notes',
        sortOrder: 1,
        isActive: true,
      };

      mockApiResponseService.onGetItem.mockResolvedValue(mockDto);
      component.id = 'loc-1';
      component.onLoadData();

      await Promise.resolve();

      expect(component.form.value).toEqual(expect.objectContaining({
        id: 'loc-1',
        customerId: 'cust-1',
        name: 'Test Location',
        locationType: CustomerLocationType.MainGate,
        phoneOne: '5512345678',
        phoneTwo: '5512345679',
        contactName: 'John Doe',
        notes: 'Test notes',
        sortOrder: 1,
        isActive: true,
      }));
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      mockApiResponseService.validateForm.mockReturnValue(false);
      component.onSubmit();
      expect(mockFormHelper.submitCrud).not.toHaveBeenCalled();
    });

    it('should call submitCrud with create endpoint for new record', () => {
      component.form.patchValue({
        customerId: 'cust-1',
        name: 'New Location',
        locationType: CustomerLocationType.Lobby,
        phoneOne: '5512345678',
      });

      component.onSubmit();

      expect(mockFormHelper.submitCrud).toHaveBeenCalledWith(expect.objectContaining({
        endpoint: 'api/customer-locations',
        method: 'POST',
      }));
    });

    it('should call submitCrud with update endpoint for existing record', () => {
      component.id = 'loc-1';
      component.form.patchValue({
        customerId: 'cust-1',
        name: 'Updated Location',
        locationType: CustomerLocationType.Office,
        phoneOne: '5512345678',
      });

      component.onSubmit();

      expect(mockFormHelper.submitCrud).toHaveBeenCalledWith(expect.objectContaining({
        endpoint: 'api/customer-locations/loc-1',
        method: 'PUT',
      }));
    });

    it('should set submitting signal to true during submission', () => {
      component.form.patchValue({
        customerId: 'cust-1',
        name: 'Test',
        locationType: CustomerLocationType.MainGate,
        phoneOne: '5512345678',
      });

      expect(component.submitting()).toBeFalse();
      component.onSubmit();
      expect(component.submitting()).toBeTrue();
    });
  });
});