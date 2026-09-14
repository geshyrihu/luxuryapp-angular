import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CustomerIdService } from 'src/app/core/auth/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';
import { SendOperationReportBaseService } from './send-operation-report-base.service';

describe('SendOperationReportBaseService', () => {
  let service: SendOperationReportBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SendOperationReportBaseService,
        { provide: AuthService, useValue: { applicationUserId: 'user-1' } },
        { provide: ApiResponseService, useValue: { onGetSelectItem: vi.fn().mockResolvedValue([]), onPost: vi.fn().mockResolvedValue(true) } },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: CustomerIdService, useValue: { customerId: vi.fn().mockReturnValue('1') } },
        { provide: TableScrollHeightService, useValue: { scrollHeight: '400px' } },
      ],
    });
    service = TestBed.inject(SendOperationReportBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize year and week', () => {
    service.initialize(2024, 10);
    expect(service.year).toBe(2024);
    expect(service.numeroSemana).toBe(10);
  });

  it('should filter selected destinatarios', () => {
    const mockItem = { email: 'test@test.com', nivelPrivacidad: 'PARA', selectControl: { value: true } };
    service.destinatariosSignal.set([mockItem]);
    const result = service.onFilterDestinatarios();
    expect(result.length).toBe(1);
    expect(result[0].email).toBe('test@test.com');
  });
});
