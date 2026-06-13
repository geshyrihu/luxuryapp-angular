import { vi } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerConfig } from './customer-config';

describe('CustomerConfig', () => {
  let component: CustomerConfig;
  let fixture: ComponentFixture<CustomerConfig>;
  let mockApiResponseS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(null),
      onPost: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };

    TestBed.overrideComponent(CustomerConfig, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [CustomerConfig],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomerConfig);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.customers()).toEqual([]);
    expect(component.selectedCustomerId()).toBeNull();
    expect(component.templates()).toEqual([]);
    expect(component.selectedItems()).toEqual(new Map());
    expect(component.submitting()).toBe(false);
  });

  it('should load customers on init', async () => {
    const fakeCustomers = [{ value: 'c1', label: 'Customer 1' }];
    mockApiResponseS.onGetSelectItem.mockResolvedValue(fakeCustomers);

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith(
      'customers-active',
    );
    expect(component.customers()).toEqual(fakeCustomers);
  });

  it('should load templates and customer config when customer selected', async () => {
    const fakeTemplates = [{ id: 't1', name: 'Template 1' }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeTemplates);
    mockApiResponseS.onGetItem.mockResolvedValue({
      enabledTaskItemIds: ['item-1', 'item-2'],
    });

    component.selectedCustomerId.set('cust-123');
    await new Promise(resolve => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      'recurring-tasks/templates/list/true',
    );
    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      'recurring-tasks/templates/config/cust-123',
    );
  });

  it('should clear templates and items when customer deselected', async () => {
    component.templates.set([{ id: 't1' } as any]);
    component.selectedItems.set(new Map([['item-1', true]]));

    component.selectedCustomerId.set(null);
    await new Promise(resolve => setTimeout(resolve));

    expect(component.templates()).toEqual([]);
    expect(component.selectedItems()).toEqual(new Map());
  });

  it('should load customer config and build selectedItems map', async () => {
    mockApiResponseS.onGetItem.mockResolvedValue({
      enabledTaskItemIds: ['a', 'b', 'c'],
    });

    await component.loadCustomerConfig('cust-123');

    const map = component.selectedItems();
    expect(map.get('a')).toBe(true);
    expect(map.get('b')).toBe(true);
    expect(map.get('c')).toBe(true);
  });

  it('should handle null config response', async () => {
    mockApiResponseS.onGetItem.mockResolvedValue(null);

    await component.loadCustomerConfig('cust-123');

    expect(component.selectedItems()).toEqual(new Map());
  });

  it('should toggle item check state', () => {
    component.selectedItems.set(new Map([['item-1', false]]));

    component.onItemCheckChange('item-1', true);

    expect(component.selectedItems().get('item-1')).toBe(true);
  });

  it('should submit config on save', async () => {
    component.selectedCustomerId.set('cust-123');
    component.selectedItems.set(new Map([['item-1', true], ['item-2', false]]));

    await component.onSave();

    expect(mockApiResponseS.onPost).toHaveBeenCalledWith(
      'recurring-tasks/templates/config',
      {
        customerId: 'cust-123',
        enabledTaskItemIds: ['item-1'],
      },
    );
    expect(component.submitting()).toBe(false);
  });

  it('should not save if no customer selected', async () => {
    await component.onSave();
    expect(mockApiResponseS.onPost).not.toHaveBeenCalled();
  });
});
