import { TestBed } from '@angular/core/testing';
import { SignalRService } from './signalr.service';
import { AuthService } from './auth.service';
import { ConsoleLoggerService } from './console-logger.service';

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SignalRService,
        { provide: AuthService, useValue: { getToken: vi.fn() } },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn(), error: vi.fn(), warn: vi.fn() } },
      ],
    });
    service = TestBed.inject(SignalRService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
