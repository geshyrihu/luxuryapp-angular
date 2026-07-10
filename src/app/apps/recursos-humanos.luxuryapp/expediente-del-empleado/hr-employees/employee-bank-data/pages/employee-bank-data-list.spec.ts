import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { EmployeeInternalService } from '../../employee-internal/services/employee-internal.service';
import { EmployeeBankDataList } from './employee-bank-data-list';
import { DialogSize } from 'src/app/core/enums/dialog-size';

describe('EmployeeBankDataList', () => {
  let fixture: ComponentFixture<EmployeeBankDataList>;
  let component: EmployeeBankDataList;

  const mockEmployeeInternalS = {
    getBankData: vi.fn().mockResolvedValue([
      { id: '1', bankName: 'Bank 1', bankAccount: '123' },
    ]),
    deleteBankData: vi.fn().mockResolvedValue(true),
  };

  const mockDialogHandlerS = {
    openDialog: vi.fn().mockResolvedValue(true),
    sizeMd: DialogSize.md,
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeBankDataList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeBankDataList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: EmployeeInternalService, useValue: mockEmployeeInternalS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeeBankDataList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values before init', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(false);
  });

  it('should load bank data on init when employeeId is provided', () => {
    fixture.componentRef.setInput('employeeId', 'emp-1');
    fixture.detectChanges();
    expect(mockEmployeeInternalS.getBankData).toHaveBeenCalledWith('emp-1');
  });

  it('should load data on onLoadData call', () => {
    mockEmployeeInternalS.getBankData.mockResolvedValue([{ id: '2', bankName: 'Bank 2' }]);
    component.onLoadData('emp-2');
    expect(mockEmployeeInternalS.getBankData).toHaveBeenCalledWith('emp-2');
    expect(component.loading()).toBe(true);
  });

  it('should open modal form on onModalForm', () => {
    fixture.componentRef.setInput('employeeId', 'emp-1');
    component.onModalForm({ id: '1', title: 'Edit' });
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it('should remove item on onDelete when result is true', () => {
    component.dataSignal.set([{ id: '1' } as any, { id: '2' } as any]);
    component.onDelete('1');
    expect(mockEmployeeInternalS.deleteBankData).toHaveBeenCalledWith('1');
  });
});
