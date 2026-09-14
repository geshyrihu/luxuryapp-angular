import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/core/services/storage.service';
import { DateRangeStorageService } from './date-range-storage.service';

describe('DateRangeStorageService', () => {
  let service: DateRangeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateRangeStorageService,
        { provide: StorageService, useValue: { store: vi.fn(), retrieve: vi.fn(), remove: vi.fn() } },
      ],
    });
    service = TestBed.inject(DateRangeStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null dates when no data stored', () => {
    const storage = TestBed.inject(StorageService);
    storage.retrieve.mockReturnValue(null);
    const result = service.getDateRange();
    expect(result).toEqual({ from: null, to: null });
  });

  it('should clear date range from storage', () => {
    const storage = TestBed.inject(StorageService);
    service.clearDateRange();
    expect(storage.remove).toHaveBeenCalledWith('ticketDateRange');
  });
});
