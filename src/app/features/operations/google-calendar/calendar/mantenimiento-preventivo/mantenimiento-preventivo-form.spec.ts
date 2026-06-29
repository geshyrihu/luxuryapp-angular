import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { vi } from 'vitest';
import { MantenimientoPreventivoForm } from './mantenimiento-preventivo-form';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import * as formHelper from 'src/app/core/helpers/form-helper';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

vi.mock('src/app/core/helpers/form-helper', () => ({
  FormHelper: { submitCrud: vi.fn() },
}));

const apiResponseSMock = {
  onGetSelectItem: vi.fn().mockResolvedValue([]),
  onGetList: vi.fn().mockResolvedValue([]),
  onGetItem: vi.fn().mockResolvedValue({
    id: 1,
    machineryId: 10,
    providerId: 20,
    accountingCatalog: { value: 30 },
    activity: 'Test',
    observation: 'Obs',
    month: 'Enero',
  }),
};
const authServiceMock = { applicationUserId: 'user-1' };
const customerIdSignal = signal('cust-1');
const customerIdSMock = { customerId: customerIdSignal };
const configMock = {
  data: {
    id: 1,
    task: 'edit',
    idMachinery: 5,
  },
};
const refMock = { close: vi.fn() };
const enumSelectSMock = {
  month: vi.fn().mockReturnValue(of([])),
  recurrence: vi.fn().mockReturnValue(of([])),
  typeMaintance: vi.fn().mockReturnValue(of([])),
};

describe('MantenimientoPreventivoForm', () => {
  let component: MantenimientoPreventivoForm;
  let fixture: ComponentFixture<MantenimientoPreventivoForm>;

  beforeEach(() => {
    TestBed.overrideComponent(MantenimientoPreventivoForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [MantenimientoPreventivoForm, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: ApiResponseService, useValue: apiResponseSMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CustomerIdService, useValue: customerIdSMock },
        { provide: DynamicDialogConfig, useValue: configMock },
        { provide: DynamicDialogRef, useValue: refMock },
        { provide: EnumSelectService, useValue: enumSelectSMock },
      ],
    });

    fixture = TestBed.createComponent(MantenimientoPreventivoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form defined with all controls', () => {
    expect(component.form.contains('activity')).toBe(true);
    expect(component.form.contains('machineryId')).toBe(true);
    expect(component.form.contains('month')).toBe(true);
    expect(component.form.contains('price')).toBe(true);
    expect(component.form.contains('providerId')).toBe(true);
    expect(component.form.contains('recurrence')).toBe(true);
    expect(component.form.contains('typeMaintance')).toBe(true);
    expect(component.form.contains('customerId')).toBe(true);
    expect(component.form.contains('accountingCatalogId')).toBe(true);
  });

  it('should have submitting as false initially', () => {
    expect(component.submitting()).toBe(false);
  });

  it('should have cb_machinery as empty initially', () => {
    expect(component.cb_machinery()).toEqual([]);
  });

  it('should have cb_providers as empty initially', () => {
    expect(component.cb_providers()).toEqual([]);
  });

  it('should have cb_recurrencia as empty initially', () => {
    expect(component.cb_recurrencia()).toEqual([]);
  });

  it('saveMachineryId should patch form', () => {
    const item = { value: 42, label: 'Móquina X' };
    component.saveMachineryId(item);
    expect(component.form.get('machineryId')?.value).toBe(42);
    expect(component.form.get('machineryName')?.value).toBe(item);
  });

  it('saveProviderId should patch form', () => {
    const item = { value: 99, label: 'Proveedor Y' };
    component.saveProviderId(item);
    expect(component.form.get('providerId')?.value).toBe(99);
    expect(component.form.get('providerName')?.value).toBe(item);
  });

  it('saveAccountingCatalog should patch form', () => {
    const item = { value: 55, label: 'Catálogo Z' };
    component.saveAccountingCatalog(item);
    expect(component.form.get('accountingCatalogId')?.value).toBe(55);
    expect(component.form.get('accountingCatalogName')?.value).toBe(item);
  });

  it('f getter should return form controls', () => {
    expect(component.f).toBe(component.form.controls);
  });

  it('onSubmit should call FormHelper.submitCrud', () => {
    component.onSubmit();
    expect(formHelper.FormHelper.submitCrud).toHaveBeenCalled();
  });
});
