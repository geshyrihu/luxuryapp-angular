import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from '@core/services/html-print.service';
import { InventarioExtintorQrService } from './inventario-extintor-qr.service';

describe('InventarioExtintorQrService', () => {
  let service: InventarioExtintorQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventarioExtintorQrService,
        { provide: HtmlPrintService, useValue: { esc: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
      ],
    });
    service = TestBed.inject(InventarioExtintorQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call printHtml when downloadQr is called', async () => {
    const htmlPrintS = TestBed.inject(HtmlPrintService);
    await service.downloadQr({ id: '1', localCode: 'C001', extinguisherType: 'Tipo A', location: 'Piso 1' } as any);
    expect(htmlPrintS.printHtml).toHaveBeenCalled();
  });
});

