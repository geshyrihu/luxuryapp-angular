import { TestBed } from '@angular/core/testing';
import {
  COBRANZA_ONLINE_STORE_AUTOLOAD,
  CobranzaOnlineStoreService,
} from './cobranza-online-store.service';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { CustomerIdService } from '@core/auth/services/customer-id.service';

describe('CobranzaOnlineStoreService', () => {
  let service: CobranzaOnlineStoreService;

  const mockApiResponseService = {
    onGetItem: vi.fn().mockResolvedValue(null),
    onPost: vi.fn().mockResolvedValue(null),
  };

  const mockCustomerIdService = {
    customerId: vi.fn().mockReturnValue('cust1'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CobranzaOnlineStoreService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: CustomerIdService, useValue: mockCustomerIdService },
      ],
    });
    service = TestBed.inject(CobranzaOnlineStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear store', () => {
    service.clearStore();
    expect(service.dashboardData()).toBeNull();
  });

  describe('loadFor (carga por parámetros explícitos)', () => {
    let store: CobranzaOnlineStoreService;
    let onGetItem: ReturnType<typeof vi.fn>;

    const dashboard = { towers: [] } as unknown;
    const analysis = { totalMorosos: 0 } as unknown;

    beforeEach(() => {
      onGetItem = vi.fn().mockImplementation((url: string) =>
        url.includes('/analysis/')
          ? Promise.resolve(analysis)
          : Promise.resolve(dashboard),
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CobranzaOnlineStoreService,
          {
            provide: ApiResponseService,
            useValue: { onGetItem, onPost: vi.fn() },
          },
          { provide: CustomerIdService, useValue: mockCustomerIdService },
          { provide: COBRANZA_ONLINE_STORE_AUTOLOAD, useValue: false },
        ],
      });
      store = TestBed.inject(CobranzaOnlineStoreService);
    });

    it('carga dashboard y análisis y apaga el loader al terminar', async () => {
      await store.loadFor('cust-9', 2026, 4, 30);

      expect(onGetItem).toHaveBeenCalledTimes(2);
      expect(store.dashboardData()).toEqual(dashboard);
      expect(store.analysisData()).toEqual(analysis);
      expect(store.isLoading()).toBe(false);
    });

    it('omite la petición de sync-status', async () => {
      await store.loadFor('cust-9', 2026, 4, 30);

      const urls = onGetItem.mock.calls.map((call) => call[0] as string);
      expect(urls.some((url) => url.includes('sync-status'))).toBe(false);
    });

    it('arma las URLs de dashboard y análisis con el corte indicado', async () => {
      await store.loadFor('cust-9', 2026, 4, 30);

      const urls = onGetItem.mock.calls.map((call) => call[0] as string);
      expect(urls).toContain(
        'cobranza/online/dashboard/customer/cust-9/year/2026/month/4?day=30',
      );
      expect(urls).toContain(
        'cobranza/online/analysis/customer/cust-9/year/2026/month/4/day/30',
      );
    });
  });
});
