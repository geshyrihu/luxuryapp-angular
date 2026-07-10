import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './jwt-interceptor.service';
import { AuthService } from './auth.service';
import { ConsoleLoggerService } from './console-logger.service';
import { Router } from '@angular/router';

describe('JwtInterceptor', () => {
  let service: JwtInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthService, useValue: { initialAuthCheckCompleted$: { pipe: vi.fn() }, getToken: vi.fn(), refreshToken: vi.fn() } },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
    service = TestBed.inject(JwtInterceptor);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
