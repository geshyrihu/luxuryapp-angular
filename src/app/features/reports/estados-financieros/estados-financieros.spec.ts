import { vi } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { EstadosFinancieros } from './estados-financieros';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';

describe('EstadosFinancieros', () => {
  let component: EstadosFinancieros;
  let fixture: ComponentFixture<EstadosFinancieros>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue(null) };
    mockCustomerIdS = { customerId: signal('cust-123') };
    mockTableScrollHeightS = { scrollHeight: signal('600px') };

    TestBed.overrideComponent(EstadosFinancieros, { set: { template: '<div>Mock</div>', imports: [] } });
    TestBed.configureTestingModule({
      imports: [EstadosFinancieros],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(EstadosFinancieros);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.loading()).toBe(true);
    expect(component.reportData()).toBeNull();
  });

  it('should call onLoadData when customerId is set via effect', () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith('Reports/EstadosFinancieros/cust-123');
  });

  it('onLoadData should set reportData with API response', async () => {
    const fakeResponse = { estadosFinancieros: [{ cuenta: '101', saldo: 5000 }], customer: { id: 'cust-123' } };
    mockApiResponseS.onGetList.mockResolvedValue(fakeResponse);
    await component.onLoadData('cust-123');
    expect(component.reportData()).toEqual(fakeResponse);
  });

  it('onLoadData should reset reportData before loading', async () => {
    component.reportData.set({ estadosFinancieros: [], customer: {} } as any);
    mockApiResponseS.onGetList.mockResolvedValue(null);
    await component.onLoadData('cust-123');
    expect(component.reportData()).toBeNull();
  });

  it('onLoadData should handle API error gracefully', async () => {
    mockApiResponseS.onGetList.mockRejectedValue(new Error('API Error'));
    await component.onLoadData('cust-123');
    expect(component.reportData()).toBeNull();
  });
});
