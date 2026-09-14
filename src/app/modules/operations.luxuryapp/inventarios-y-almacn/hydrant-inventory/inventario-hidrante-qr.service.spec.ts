import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { InventarioHidranteQrService } from './inventario-hidrante-qr.service';

describe('InventarioHidranteQrService', () => {
  let service: InventarioHidranteQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventarioHidranteQrService,
        { provide: HtmlPrintService, useValue: { esc: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
      ],
    });
    service = TestBed.inject(InventarioHidranteQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call printHtml when downloadQr is called', async () => {
    const htmlPrintS = TestBed.inject(HtmlPrintService);
    await service.downloadQr({ id: '1', localCode: 'H001', hydrantType: 'Hidrante', location: 'Piso 1' } as any);
    expect(htmlPrintS.printHtml).toHaveBeenCalled();
  });
});
