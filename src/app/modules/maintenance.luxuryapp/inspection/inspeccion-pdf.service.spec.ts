import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { InspeccionPdfService } from './inspeccion-pdf.service';

describe('InspeccionPdfService', () => {
  let service: InspeccionPdfService;

  const mockHtmlPrintService = {
    printHtml: vi.fn(),
    getLogoDataUrl: vi.fn().mockResolvedValue('data:image/png;base64,logo'),
    getStandardCss: vi.fn().mockReturnValue(''),
    buildStandardHeader: vi.fn().mockReturnValue('<header></header>'),
    buildStandardFooter: vi.fn().mockReturnValue('<footer></footer>'),
    esc: vi.fn((s: string) => s),
  };

  const mockToastService = {
    showError: vi.fn(),
    showInfo: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InspeccionPdfService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
        { provide: CustomToastService, useValue: mockToastService },
      ],
    });

    service = TestBed.inject(InspeccionPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error toast when data is null', async () => {
    await service.generarReporte(null);

    expect(mockToastService.showError).toHaveBeenCalled();
  });

  it('should show info toast and print when data is provided', async () => {
    const data = { name: 'Test', departament: 'Dep', frequency: 'Diaria', user: 'User', results: [] };

    await service.generarReporte(data);

    expect(mockToastService.showInfo).toHaveBeenCalled();
    expect(mockHtmlPrintService.printHtml).toHaveBeenCalled();
  });
});
