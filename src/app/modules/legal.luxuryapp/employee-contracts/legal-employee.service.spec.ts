import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { CustomerIdService } from '@core/auth/services/customer-id.service';
import { LegalEmployeeService } from './legal-employee.service';

describe('LegalEmployeeService', () => {
  let service: LegalEmployeeService;

  const mockApiResponseService = {
    onGetList: vi.fn(),
  };

  const mockCustomerIdService = {
    customerId: vi.fn().mockReturnValue('cust-1'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LegalEmployeeService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: CustomerIdService, useValue: mockCustomerIdService },
      ],
    });

    service = TestBed.inject(LegalEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(service.employees()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should sort employees by department and name', () => {
    service.employees.set([
      { department: 'B', fullName: 'Zoe', employeeId: '1' } as any,
      { department: 'A', fullName: 'Ana', employeeId: '2' } as any,
    ]);

    const sorted = service.employeesByDepartment();

    expect(sorted[0].department).toBe('A');
    expect(sorted[1].department).toBe('B');
  });
});

