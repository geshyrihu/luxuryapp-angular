import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { MinutaPdfService } from './minuta-pdf.service';

describe('MinutaPdfService', () => {
  let service: MinutaPdfService;

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
        MinutaPdfService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
      ],
    });

    service = TestBed.inject(MinutaPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call printHtml when downloadMinuta is called', async () => {
    const data = { minuta: { date: '2026-01-01 10:00', eTypeMeeting: 'Junta' }, comite: [], administracion: [], externos: [], asuntos: [] };

    await service.downloadMinuta(data, 'test-file');

    expect(mockHtmlPrintService.printHtml).toHaveBeenCalled();
  });
});
