import { TestBed } from '@angular/core/testing';
import { SecurityService } from './security.service';
import { ConsoleLoggerService } from './console-logger.service';
import { StorageService } from './storage.service';

describe('SecurityService', () => {
  let service: SecurityService;
  let storageMock: {
    store: ReturnType<typeof vi.fn>;
    retrieve: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  const mockToken = {
    token: 'jwt-token-123',
    roles: ['SuperUsuario'],
    expiration: '2026-12-31T23:59:59',
    infoUserAuthDTO: {
      applicationUserId: 'guid-user',
      userName: 'testuser',
    },
    customerAccess: [],
  };

  beforeEach(() => {
    storageMock = {
      store: vi.fn(),
      retrieve: vi.fn(),
      remove: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SecurityService,
        { provide: StorageService, useValue: storageMock },
        { provide: ConsoleLoggerService, useValue: { custom: vi.fn() } },
      ],
    });

    service = TestBed.inject(SecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setAuthData', () => {
    it('should store userAuthData and accessToken', () => {
      service.setAuthData(mockToken as any);

      expect(storageMock.store).toHaveBeenCalledWith('userAuthData', mockToken);
      expect(storageMock.store).toHaveBeenCalledWith(
        'accessToken',
        mockToken.token,
      );
    });
  });

  describe('getAuthData', () => {
    it('should return parsed auth data when exists', () => {
      storageMock.retrieve.mockReturnValue(mockToken);

      const result = service.getAuthData();

      expect(result).toEqual(mockToken as any);
      expect(storageMock.retrieve).toHaveBeenCalledWith('userAuthData');
    });

    it('should return null when no auth data exists', () => {
      storageMock.retrieve.mockReturnValue(null);

      const result = service.getAuthData();

      expect(result).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return the access token', () => {
      storageMock.retrieve.mockReturnValue('jwt-token-123');

      const result = service.getToken();

      expect(result).toBe('jwt-token-123');
      expect(storageMock.retrieve).toHaveBeenCalledWith('accessToken');
    });

    it('should return null when no token stored', () => {
      storageMock.retrieve.mockReturnValue(null);

      const result = service.getToken();

      expect(result).toBeNull();
    });
  });

  describe('resetAuthData', () => {
    it('should remove userAuthData and accessToken', () => {
      service.resetAuthData();

      expect(storageMock.remove).toHaveBeenCalledWith('userAuthData');
      expect(storageMock.remove).toHaveBeenCalledWith('accessToken');
    });
  });
});
