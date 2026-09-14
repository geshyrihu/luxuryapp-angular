import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { InventarioEstacionManualQrService } from './inventario-estacion-manual-qr.service';

describe('InventarioEstacionManualQrService', () => {
  let service: InventarioEstacionManualQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventarioEstacionManualQrService,
        { provide: HtmlPrintService, useValue: { esc: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
      ],
    });
    service = TestBed.inject(InventarioEstacionManualQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call printHtml when downloadQr is called', async () => {
    const htmlPrintS = TestBed.inject(HtmlPrintService);
    await service.downloadQr({ id: '1', localCode: 'E001', stationType: 'Estación', location: 'Piso 1' } as any);
    expect(htmlPrintS.printHtml).toHaveBeenCalled();
  });
});
