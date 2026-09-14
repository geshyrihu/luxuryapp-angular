import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { InventarioDetectorHumoQrService } from './inventario-detector-humo-qr.service';

describe('InventarioDetectorHumoQrService', () => {
  let service: InventarioDetectorHumoQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventarioDetectorHumoQrService,
        { provide: HtmlPrintService, useValue: { esc: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
      ],
    });
    service = TestBed.inject(InventarioDetectorHumoQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call printHtml when downloadQr is called', async () => {
    const htmlPrintS = TestBed.inject(HtmlPrintService);
    await service.downloadQr({ id: '1', localCode: 'D001', detectorType: 'Detector', location: 'Piso 1' } as any);
    expect(htmlPrintS.printHtml).toHaveBeenCalled();
  });
});
