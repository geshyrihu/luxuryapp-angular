import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { GeneralAnualMantenimiento } from './general-anual-mantenimiento';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

const apiResponseSMock = {
  onGetList: vi.fn().mockResolvedValue([]),
};
const customerIdSignal = signal('cust-1');
const customerIdSMock = { customerId: customerIdSignal };

describe('GeneralAnualMantenimiento', () => {
  let component: GeneralAnualMantenimiento;
  let fixture: ComponentFixture<GeneralAnualMantenimiento>;

  beforeEach(() => {
    TestBed.overrideComponent(GeneralAnualMantenimiento, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [GeneralAnualMantenimiento, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseSMock },
        { provide: CustomerIdService, useValue: customerIdSMock },
      ],
    });

    fixture = TestBed.createComponent(GeneralAnualMantenimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty dataSignal initially', () => {
    expect(component.dataSignal()).toEqual([]);
  });

  it('should have empty cb_providers initially', () => {
    expect(component.cb_providers()).toEqual([]);
  });

  it('should have providerIdControl as empty string', () => {
    expect(component.providerIdControl.value).toBe('');
  });

  it('onLoadProveedores should fetch and set providers', async () => {
    apiResponseSMock.onGetList.mockResolvedValue([{ value: 1, label: 'Prov1' }]);
    component.onLoadProveedores();
    await new Promise(resolve => setTimeout(resolve));
    expect(apiResponseSMock.onGetList).toHaveBeenCalledWith('MaintenanceCalendars/ProveedoresCalendario/cust-1');
    expect(component.cb_providers()).toEqual([{ value: 1, label: 'Prov1' }]);
  });

  it('onLoadData should clear dataSignal, fetch and set data', async () => {
    component.dataSignal.set([{ dummy: true }]);
    apiResponseSMock.onGetList.mockResolvedValue([{ id: 1, name: 'Item' }]);
    component.onLoadData();
    expect(component.dataSignal()).toEqual([]);
    await new Promise(resolve => setTimeout(resolve));
    expect(apiResponseSMock.onGetList).toHaveBeenCalledWith('MaintenanceCalendars/GeneralMantenimiento/cust-1/');
    expect(component.dataSignal()).toEqual([{ id: 1, name: 'Item' }]);
  });
});
