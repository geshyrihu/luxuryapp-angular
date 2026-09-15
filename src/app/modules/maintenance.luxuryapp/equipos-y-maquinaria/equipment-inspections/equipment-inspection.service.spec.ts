import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { CustomerIdService } from '@core/auth/services/customer-id.service';
import { EquipmentInspectionService } from './equipment-inspection.service';

describe('EquipmentInspectionService', () => {
  let service: EquipmentInspectionService;

  const mockApiResponseService = {
    onGetList: vi.fn(),
    onGetItem: vi.fn(),
    onPost: vi.fn(),
    onPut: vi.fn(),
    onDelete: vi.fn(),
    onGetSelectItem: vi.fn(),
  };

  const mockCustomerIdService = {
    customerId: vi.fn().mockReturnValue('cust-1'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EquipmentInspectionService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: CustomerIdService, useValue: mockCustomerIdService },
      ],
    });

    service = TestBed.inject(EquipmentInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default options', () => {
    expect(service.recurrenceOptions.length).toBeGreaterThan(0);
    expect(service.severityOptions.length).toBeGreaterThan(0);
    expect(service.qrTypeOptions.length).toBeGreaterThan(0);
    expect(service.weekDayOptions.length).toBe(7);
  });

  it('should return correct severity label', () => {
    expect(service.getSeverityLabel(1)).toBe('Normal');
    expect(service.getSeverityLabel(2)).toBe('No Grave');
    expect(service.getSeverityLabel(3)).toBe('Urgente');
    expect(service.getSeverityLabel(null)).toBe('Sin cierre');
  });
});

