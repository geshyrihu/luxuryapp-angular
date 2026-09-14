import { TestBed } from '@angular/core/testing';
import { AspelCobranzaHausPdfService } from './aspel-cobranza-haus-pdf.service';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';

describe('AspelCobranzaHausPdfService', () => {
  let service: AspelCobranzaHausPdfService;

  const mockHtmlPrintService = {
    getLogoDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,logo'),
    printHtml: vi.fn(),
    getStandardCss: vi.fn().mockReturnValue(''),
    buildStandardHeader: vi.fn().mockReturnValue('<header></header>'),
    buildStandardFooter: vi.fn().mockReturnValue('<footer></footer>'),
    esc: vi.fn((val: string) => val),
    formatDateTime: vi.fn().mockReturnValue('01/01/2026'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AspelCobranzaHausPdfService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
      ],
    });
    service = TestBed.inject(AspelCobranzaHausPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download aviso cobro', async () => {
    const mockData = { conceptos: [], departamento: 'Test' } as any;
    await service.downloadAvisoCobro(mockData, new Date());
    expect(mockHtmlPrintService.getLogoDataUrl).toHaveBeenCalled();
    expect(mockHtmlPrintService.printHtml).toHaveBeenCalled();
  });
});
