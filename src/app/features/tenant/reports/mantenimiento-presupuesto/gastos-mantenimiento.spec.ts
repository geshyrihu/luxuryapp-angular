import { vi } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { GastosMantenimiento } from './gastos-mantenimiento';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { MantenimientoPreventivoForm } from '../../calendar/mantenimiento-preventivo/mantenimiento-preventivo-form';

describe('GastosMantenimiento', () => {
  let component: GastosMantenimiento;
  let fixture: ComponentFixture<GastosMantenimiento>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue({ items: [], totalGastos: 0 }) };
    mockCustomerIdS = { customerId: signal('cust-123') };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeFull: 'full',
    };
    mockTableScrollHeightS = { scrollHeight: signal('600px') };

    TestBed.overrideComponent(GastosMantenimiento, { set: { template: '<div>Mock</div>', imports: [] } });
    TestBed.configureTestingModule({
      imports: [GastosMantenimiento],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(GastosMantenimiento);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.data()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.resumenGastos()).toEqual([]);
    expect(component.totalGasto()).toBe(0);
    expect(component.tablePrimeNgRows).toBe(30);
    expect(component.rowsPerPageOptions).toEqual([30, 50, 75, 100, 150, 200]);
  });

  it('should call onLoadData when customerId is set via effect', () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledTimes(2);
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('BudgetMaintenance/SummaryOfExpenses/cust-123');
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('BudgetMaintenance/Resumengastos/cust-123');
  });

  it('onLoadData should set data, totalGasto, and resumenGastos from API', async () => {
    const result1 = { items: [{ id: 1, concepto: 'Mantenimiento' }], totalGastos: 15000 };
    const result2 = [{ categoria: 'General', monto: 10000 }];
    mockApiResponseS.onGetList = vi.fn()
      .mockResolvedValueOnce(result1)
      .mockResolvedValueOnce(result2);

    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));

    expect(component.data()).toEqual(result1.items);
    expect(component.totalGasto()).toBe(15000);
    expect(component.resumenGastos()).toEqual(result2);
    expect(component.loading()).toBe(false);
  });

  it('onLoadData should set loading to false when API fails', async () => {
    mockApiResponseS.onGetList.mockRejectedValue(new Error('API Error'));
    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));
    expect(component.loading()).toBe(false);
  });

  it('onModalItem should open dialog with MantenimientoPreventivoForm', () => {
    const item = { id: 5, idEquipo: 10, concepto: 'Reparacion' };
    component.onModalItem(item);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      MantenimientoPreventivoForm,
      { id: 5, task: 'edit', idMachinery: 10 },
      'Editar regitro',
      'full',
    );
  });

  it('onModalItem should reload data on dialog close with true', async () => {
    mockDialogHandlerS.openDialog.mockResolvedValue(true);
    component.onModalItem({ id: 1, idEquipo: 2 });
    await new Promise(resolve => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });
});
