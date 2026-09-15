import { TestBed } from '@angular/core/testing';
import { CustomToastService } from '@core/services/custom-toast.service';
import { HtmlPrintService } from '@core/services/html-print.service';
import { InventarioExtintorPdfService } from './inventario-extintor-pdf.service';

describe('InventarioExtintorPdfService', () => {
  let service: InventarioExtintorPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventarioExtintorPdfService,
        { provide: CustomToastService, useValue: { showInfo: vi.fn() } },
        { provide: HtmlPrintService, useValue: { getLogoDataUrl: vi.fn().mockResolvedValue(''), esc: vi.fn().mockReturnValue(''), getStandardCss: vi.fn().mockReturnValue(''), buildStandardHeader: vi.fn().mockReturnValue(''), buildStandardFooter: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
      ],
    });
    service = TestBed.inject(InventarioExtintorPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call printHtml when downloadPdf is called', async () => {
    const htmlPrintS = TestBed.inject(HtmlPrintService);
    await service.downloadPdf([]);
    expect(htmlPrintS.printHtml).toHaveBeenCalled();
  });
});

