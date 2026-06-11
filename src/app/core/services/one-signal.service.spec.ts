import { TestBed } from '@angular/core/testing';
import { OneSignalService } from './one-signal.service';
import { AuthService } from './auth.service';
import { ConsoleLoggerService } from './console-logger.service';
import { Router } from '@angular/router';

describe('OneSignalService', () => {
  let service: OneSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OneSignalService,
        { provide: AuthService, useValue: {} },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn() } },
        { provide: Router, useValue: { navigateByUrl: vi.fn() } },
      ],
    });
    service = TestBed.inject(OneSignalService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
