import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { EstacionManualBitacoraPdfService } from './estacion-manual-bitacora-pdf.service';

describe('EstacionManualBitacoraPdfService', () => {
  let service: EstacionManualBitacoraPdfService;

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
        EstacionManualBitacoraPdfService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
      ],
    });

    service = TestBed.inject(EstacionManualBitacoraPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have downloadPdf method', () => {
    expect(typeof service.downloadPdf).toBe('function');
  });

  it('should call printHtml when downloadPdf is called', async () => {
    await service.downloadPdf(
      [{ date: '2026-01-01', hour: '10:00', accessibleAndVisible: true, housingOk: true, leverOk: true, glassIntact: true, mountingSecure: true, signageOk: true, observations: '' }],
      null,
      null,
    );

    expect(mockHtmlPrintService.printHtml).toHaveBeenCalled();
  });
});
