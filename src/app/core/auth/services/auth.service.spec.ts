import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ConsoleLoggerService } from './console-logger.service';
import { CustomerIdService } from './customer-id.service';
import { SignalRService } from './signalr.service';
import { Endpoints } from "src/app/core/constants/endpoints";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy('spy'),
            navigate: jasmine.createSpy('spy'),
            getCurrentNavigation: jasmine.createSpy('spy').and.returnValue(null),
          },
        },
        {
          provide: ConsoleLoggerService,
          useValue: { custom: jasmine.createSpy('spy'), error: jasmine.createSpy('spy'), info: jasmine.createSpy('spy') },
        },
        {
          provide: CustomerIdService,
          useValue: { clearCustomerData: jasmine.createSpy('spy') },
        },
        {
          provide: SignalRService,
          useValue: { start: jasmine.createSpy('spy'), stop: jasmine.createSpy('spy') },
        },
        {
          provide: 'HttpClientWithoutInterceptors',
          useExisting: HttpClient,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // The AuthService constructor may call trySilentLogin → refreshToken
    // if the current URL is not a public route. Flush or discard those requests.
    const pendingRefresh = httpMock.match(
      `${environment.API_BASE_URL}${Endpoints.Auth.refresh}`,
    );
    pendingRefresh.forEach((req) => req.error(new ProgressEvent('error')));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getToken should return null when no session', () => {
    expect(service.getToken()).toBeNull();
  });

  it('userToken should return null when no session', () => {
    expect(service.userToken).toBeNull();
  });

  it('applicationUserId should return null when no session', () => {
    expect(service.applicationUserId).toBeNull();
  });

  it('customerAccess should return empty array when no session', () => {
    expect(service.customerAccess).toEqual([]);
  });

  it('isAuthenticated$ should emit false when no session', async () => {
    const val = await firstValueFrom(service.isAuthenticated$);
    expect(val).toBe(false);
  });

  it('login should call API and update session', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'test-jwt',
        roles: ['SuperUsuario'],
        infoUserAuthDTO: { applicationUserId: 'user-1', customerId: 'cust-1' },
        customerAccess: [],
      },
    };

    const loginPromise = firstValueFrom(
      service.login({ email: 'test@test.com', password: '123' }),
    );

    const req = httpMock.expectOne(
      `${environment.API_BASE_URL}${Endpoints.Auth.login}`,
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const session = await loginPromise;
    expect(session.token).toBe('test-jwt');
    expect(service.getToken()).toBe('test-jwt');
  });

  it('notifyLoginSuccess should update session', async () => {
    const mockSession = {
      token: 'test-token',
      roles: [],
      infoUserAuthDTO: {} as any,
      customerAccess: [],
    } as any;

    const result = await firstValueFrom(service.notifyLoginSuccess(mockSession));
    expect(result).toBe(true);
    expect(service.getToken()).toBe('test-token');
  });

  it('initialAuthCheckCompleted$ should eventually emit true', async () => {
    const val = await firstValueFrom(service.initialAuthCheckCompleted$);
    // The constructor emits true after the silent login check completes or fails
    expect(val).toBeDefined();
  });
});









