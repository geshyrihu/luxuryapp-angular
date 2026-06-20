import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from './menu.service';
import { ApiResponseService } from './api-response.service';
import { AuthService } from './auth.service';
import { ConsoleLoggerService } from './console-logger.service';
import { CustomerIdService } from './customer-id.service';
import { signal } from '@angular/core';

describe('MenuService', () => {
  let service: MenuService;
  let userToken$: BehaviorSubject<any>;

  beforeEach(() => {
    userToken$ = new BehaviorSubject<any>(null);

    const customerIdSignal = signal<string>('');
    const customerDataReadySignal = signal<boolean>(false);

    TestBed.configureTestingModule({
      providers: [
        MenuService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]) } },
        {
          provide: AuthService,
          useValue: {
            userToken$,
            get applicationUserId() {
              return userToken$.value?.infoUserAuthDTO?.applicationUserId ?? null;
            },
          },
        },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn(), error: vi.fn(), info: vi.fn() } },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: customerIdSignal,
            customerDataReady: customerDataReadySignal,
          },
        },
      ],
    });
    service = TestBed.inject(MenuService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
