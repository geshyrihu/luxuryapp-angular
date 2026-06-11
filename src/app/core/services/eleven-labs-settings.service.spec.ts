import { TestBed } from '@angular/core/testing';
import { ElevenLabsSettingsService } from './eleven-labs-settings.service';
import { ApiResponseService } from './api-response.service';
import { StorageService } from './storage.service';

describe('ElevenLabsSettingsService', () => {
  let service: ElevenLabsSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ElevenLabsSettingsService,
        { provide: ApiResponseService, useValue: {} },
        { provide: StorageService, useValue: { retrieve: vi.fn(), store: vi.fn() } },
      ],
    });
    service = TestBed.inject(ElevenLabsSettingsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
