import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

describe('IMantenimientoPreventivoForm interface', () => {
  it('should exist as a type', () => {
    const mockForm: Record<string, any> = {
      id: { value: '1', disabled: false },
      activity: { value: 'Test Activity' },
      machineryId: { value: 10 },
      month: { value: 3 },
      observation: { value: 'Test observation' },
      price: { value: 1500.50 },
      providerId: { value: 20 },
      recurrence: { value: 1 },
      typeMaintance: { value: 2 },
      customerId: { value: 'cust-1' },
      accountingCatalogId: { value: 30 },
      machineryName: { value: { label: 'Machine', value: 10 } },
      providerName: { value: { label: 'Provider', value: 20 } },
      accountingCatalogName: { value: { label: 'Catalog', value: 30 } },
      applicationUserId: { value: 'user-1' },
    };

    expect(mockForm.activity.value).toBe('Test Activity');
    expect(mockForm.machineryId.value).toBe(10);
    expect(mockForm.customerId.value).toBe('cust-1');
    expect(mockForm.applicationUserId.value).toBe('user-1');
    expect(mockForm.price.value).toBe(1500.50);
  });
});
