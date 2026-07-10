import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from './api-response.service';
import { CustomToastService } from './custom-toast.service';
import { ConsoleLoggerService } from './console-logger.service';
import { GlobalErrorService } from './global-error.service';
import { DataConnectorService } from './data-connector.service';
import { LoaderService } from './loader.service';

describe('ApiResponseService', () => {
  let service: ApiResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiResponseService,
        { provide: CustomToastService, useValue: { showSuccess: vi.fn(), showError: vi.fn() } },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn(), error: vi.fn() } },
        { provide: GlobalErrorService, useValue: { setGlobalError: vi.fn() } },
        { provide: DataConnectorService, useValue: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn(), postFile: vi.fn(), getFile: vi.fn(), getFileFromFullUrl: vi.fn() } },
        { provide: LoaderService, useValue: { show: vi.fn(), hide: vi.fn() } },
      ],
    });
    service = TestBed.inject(ApiResponseService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
