import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler, GlobalErrorService } from './global-error-handler.service';

describe('GlobalErrorService', () => {
  let service: GlobalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorService],
    });
    service = TestBed.inject(GlobalErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should capture an error', () => {
    service.captureError(new Error('test error'));
    expect(service.lastError()).toBeTruthy();
    expect(service.lastError()?.message).toBe('test error');
  });

  it('should cap errors at maxErrors', () => {
    for (let i = 0; i < 60; i++) {
      service.captureError(`error ${i}`);
    }
    expect(service.errors().length).toBe(50);
  });
});

describe('GlobalErrorHandler', () => {
  let errorHandler: GlobalErrorHandler;
  let errorService: GlobalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: GlobalErrorService, useValue: { captureError: vi.fn(), markHandled: vi.fn(), clear: vi.fn() } },
      ],
    });
    errorHandler = TestBed.inject(GlobalErrorHandler);
    errorService = TestBed.inject(GlobalErrorService);
  });

  it('should be created', () => {
    expect(errorHandler).toBeTruthy();
  });

  it('should forward errors to GlobalErrorService', () => {
    const err = new Error('test');
    errorHandler.handleError(err);
    expect(errorService.captureError).toHaveBeenCalledWith(err);
  });
});
