import { TestBed } from '@angular/core/testing';
import { PlatformService } from './platform.service';
import { Platform } from '@ionic/angular';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlatformService,
        { provide: Platform, useValue: { is: vi.fn().mockReturnValue(false) } },
      ],
    });
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isMobile signal', () => {
    expect(typeof service.isMobile()).toBe('boolean');
  });
});
