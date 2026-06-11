import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { ConsoleLoggerService } from './console-logger.service';
import { CustomerIdService } from './customer-id.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuService,
        { provide: ApiResponseService, useValue: {} },
        { provide: AuthService, useValue: { applicationUserId: 'test' } },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn(), error: vi.fn() } },
        { provide: CustomerIdService, useValue: { customerId: vi.fn(), customerDataReady: vi.fn() } },
      ],
    });
    service = TestBed.inject(MenuService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
