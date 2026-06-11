import { TestBed } from '@angular/core/testing';
import { ElevenLabsService } from './eleven-labs.service';
import { ApiResponseService } from './api-response.service';
import { ElevenLabsSettingsService } from './eleven-labs-settings.service';

describe('ElevenLabsService', () => {
  let service: ElevenLabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ElevenLabsService,
        { provide: ApiResponseService, useValue: {} },
        { provide: ElevenLabsSettingsService, useValue: { getSettings: vi.fn(), loadFromServer: vi.fn(), saveSettings: vi.fn() } },
      ],
    });
    service = TestBed.inject(ElevenLabsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
