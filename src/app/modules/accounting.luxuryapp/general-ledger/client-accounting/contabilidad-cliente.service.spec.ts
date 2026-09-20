import { TestBed } from '@angular/core/testing';
import { ContabilidadClienteService } from './contabilidad-cliente.service';
import { ApiResponseService } from '@core/http/services/api-response.service';

describe('ContabilidadClienteService', () => {
  let service: ContabilidadClienteService;

  const mockApiResponseService = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContabilidadClienteService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
      ],
    });
    service = TestBed.inject(ContabilidadClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api onGetItem for getEpf', () => {
    service.getEpf('cust1', 2026, 1);
    expect(mockApiResponseService.onGetItem).toHaveBeenCalled();
  });
});

