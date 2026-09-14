import { TestBed } from '@angular/core/testing';
import { CustomerIdService } from 'src/app/core/auth/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { OrdenesServicioListPdfService } from './ordenes-servicio-list-pdf.service';

describe('OrdenesServicioListPdfService', () => {
  let service: OrdenesServicioListPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrdenesServicioListPdfService,
        { provide: CustomToastService, useValue: { showWarn: vi.fn(), showInfo: vi.fn() } },
        { provide: HtmlPrintService, useValue: { getLogoDataUrl: vi.fn().mockResolvedValue(''), esc: vi.fn().mockReturnValue(''), getStandardCss: vi.fn().mockReturnValue(''), buildStandardHeader: vi.fn().mockReturnValue(''), buildStandardFooter: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
        { provide: ApiResponseService, useValue: { onGetItem: vi.fn().mockResolvedValue({}), onPost: vi.fn().mockResolvedValue([]) } },
        { provide: CustomerIdService, useValue: { customerId: vi.fn().mockReturnValue('1') } },
      ],
    });
    service = TestBed.inject(OrdenesServicioListPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should warn when downloadReporteTablaCategoria receives empty data', async () => {
    const toast = TestBed.inject(CustomToastService);
    await service.downloadReporteTablaCategoria([], '2024-01', 'Test');
    expect(toast.showWarn).toHaveBeenCalled();
  });
});
