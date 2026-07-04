import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));
vi.mock('src/app/core/components/web/pdf-viewer-modal/pdf-viewer-modal', () => ({
  PdfViewerModal: class {},
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ContractsPolicies } from './contracts-policies';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';

describe('ContractsPolicies', () => {
  let component: ContractsPolicies;
  let fixture: ComponentFixture<ContractsPolicies>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue([]) };
    mockCustomerIdS = { customerId: signal('cust-123') };
    mockTableScrollHeightS = { scrollHeight: signal('600px') };

    TestBed.overrideComponent(ContractsPolicies, { set: { template: '<div>Mock</div>', imports: [] } });
    TestBed.configureTestingModule({
      imports: [ContractsPolicies],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ContractsPolicies);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.tablePrimeNgRows).toBe(30);
    expect(component.rowsPerPageOptions).toEqual([30, 50, 75, 100, 150, 200]);
  });

  it('should have globalFilterFields computed as empty when dataSignal is empty', () => {
    expect(component.globalFilterFields()).toEqual([]);
  });

  it('should call onLoadData when customerId is set via effect', () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('PolicyContract/List/cust-123');
  });

  it('onLoadData should set dataSignal from API response', async () => {
    const fakeData = [{ id: 1, endDate: '2026-06-01' }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);
    component.onLoadData();
    await new Promise(resolve => setTimeout(resolve));
    expect(component.dataSignal()).toEqual(fakeData);
  });

  it('isCloseToEndDate should return true when endDate is within 45 days', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    expect(component.isCloseToEndDate(futureDate.toISOString())).toBe(true);
  });

  it('isCloseToEndDate should return false when endDate is more than 45 days away', () => {
    const farDate = new Date();
    farDate.setDate(farDate.getDate() + 100);
    expect(component.isCloseToEndDate(farDate.toISOString())).toBe(false);
  });

  it('globalFilterFields should return keys of first data item', () => {
    component.dataSignal.set([{ name: 'test', value: 1 }]);
    expect(component.globalFilterFields()).toEqual(['name', 'value']);
  });
});

