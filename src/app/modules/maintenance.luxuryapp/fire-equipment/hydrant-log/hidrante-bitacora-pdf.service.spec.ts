import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from '@core/services/html-print.service';
import { HidranteBitacoraPdfService } from './hidrante-bitacora-pdf.service';

describe('HidranteBitacoraPdfService', () => {
  let service: HidranteBitacoraPdfService;

  const mockHtmlPrintService = {
    printHtml: vi.fn(),
    getLogoDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,logo'),
    getStandardCss: vi.fn().mockReturnValue(''),
    buildStandardHeader: vi.fn().mockReturnValue('<header></header>'),
    buildStandardFooter: vi.fn().mockReturnValue('<footer></footer>'),
    esc: vi.fn((s: string) => s),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HidranteBitacoraPdfService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
      ],
    });

    service = TestBed.inject(HidranteBitacoraPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have downloadPdf method', () => {
    expect(typeof service.downloadPdf).toBe('function');
  });

  it('should call printHtml when downloadPdf is called', async () => {
    await service.downloadPdf(
      [{ date: '2026-01-01', hour: '10:00', labelPresent: true, glassIntact: true, wrenchPresent: true, hoseOk: true, nozzlePresent: true, valveOperational: true, lockOk: true, cabinetState: '' }],
      null,
      null,
    );

    expect(mockHtmlPrintService.printHtml).toHaveBeenCalled();
  });
});

