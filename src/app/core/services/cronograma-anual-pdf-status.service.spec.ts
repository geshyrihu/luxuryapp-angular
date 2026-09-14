import { TestBed } from '@angular/core/testing';
import { CronogramaAnualPdfStatusService } from './cronograma-anual-pdf-status.service';
import { ApiResponseService } from '../http/services/api-response.service';

describe('CronogramaAnualPdfStatusService', () => {
  let service: CronogramaAnualPdfStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CronogramaAnualPdfStatusService,
        { provide: ApiResponseService, useValue: { onGetItem: vi.fn().mockResolvedValue([]) } },
      ],
    });
    service = TestBed.inject(CronogramaAnualPdfStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call onGetItem with correct url', async () => {
    const api = TestBed.inject(ApiResponseService);
    await service.getPdfStatus('cust-1');
    expect(api.onGetItem).toHaveBeenCalledWith(
      'maintenance-calendars/cronograma-anual-pdf-status/cust-1'
    );
  });

  it('should append query params when provided', async () => {
    const api = TestBed.inject(ApiResponseService);
    await service.getPdfStatus('cust-1', 5, 2025);
    expect(api.onGetItem).toHaveBeenCalledWith(
      'maintenance-calendars/cronograma-anual-pdf-status/cust-1?year=2025&filterId=5'
    );
  });
});
