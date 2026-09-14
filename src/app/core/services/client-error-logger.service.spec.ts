import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ClientErrorLoggerService } from './client-error-logger.service';

describe('ClientErrorLoggerService', () => {
  let service: ClientErrorLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientErrorLoggerService,
        { provide: HttpClient, useValue: { post: vi.fn().mockReturnValue({ subscribe: vi.fn() }) } },
      ],
    });
    service = TestBed.inject(ClientErrorLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.post on logError', () => {
    const http = TestBed.inject(HttpClient);
    service.logError('test message', 'details');
    expect(http.post).toHaveBeenCalled();
  });
});
