import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { PlatformService } from 'src/app/core/services/platform.service';
import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfirmService,
        { provide: PlatformService, useValue: { isMobile: vi.fn().mockReturnValue(false) } },
        { provide: AlertController, useValue: { create: vi.fn().mockResolvedValue({ present: vi.fn() }) } },
      ],
    });
    service = TestBed.inject(ConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use mobile path when isMobile returns true', async () => {
    const platform = TestBed.inject(PlatformService);
    platform.isMobile.mockReturnValue(true);
    const alertCtrl = TestBed.inject(AlertController);
    service.confirm('Test message');
    expect(alertCtrl.create).toHaveBeenCalled();
  });
});
