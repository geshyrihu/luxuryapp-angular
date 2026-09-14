import { TestBed } from '@angular/core/testing';
import { AutitoriaCuentasAspelExportService } from './autitoria-cuentas-aspel-export.service';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';

describe('AutitoriaCuentasAspelExportService', () => {
  let service: AutitoriaCuentasAspelExportService;

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
        AutitoriaCuentasAspelExportService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
      ],
    });
    service = TestBed.inject(AutitoriaCuentasAspelExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should exportCatalogoExcel call htmlPrintS methods when exporting PDF', async () => {
    const emptyCuentas: any[] = [];
    const emptyCustomers: any[] = [];
    await service.exportCatalogoPdf(emptyCuentas, emptyCustomers, 2026, 'Test');
    expect(mockHtmlPrintService.getLogoDataUrl).toHaveBeenCalled();
    expect(mockHtmlPrintService.printHtml).toHaveBeenCalled();
  });
});
