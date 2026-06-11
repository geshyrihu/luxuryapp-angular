import { TestBed } from '@angular/core/testing';
import { UpdateService } from './update-pwa.service';
import { SwUpdate } from '@angular/service-worker';

describe('UpdateService', () => {
  let service: UpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdateService,
        { provide: SwUpdate, useValue: { isEnabled: false, versionUpdates: { subscribe: vi.fn() }, checkForUpdate: vi.fn(), activateUpdate: vi.fn() } },
      ],
    });
    service = TestBed.inject(UpdateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
