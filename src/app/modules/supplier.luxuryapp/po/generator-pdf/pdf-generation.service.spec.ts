import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { CustomerIdService } from 'src/app/core/auth/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { PdfGenerationService } from './pdf-generation.service';

describe('PdfGenerationService', () => {
  let service: PdfGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PdfGenerationService,
        { provide: ApiResponseService, useValue: { onGetItem: vi.fn().mockResolvedValue({}), onDownloadFilePost: vi.fn() } },
        { provide: HtmlPrintService, useValue: { getLogoDataUrl: vi.fn().mockResolvedValue(''), esc: vi.fn().mockReturnValue(''), getStandardCss: vi.fn().mockReturnValue(''), buildStandardHeader: vi.fn().mockReturnValue(''), buildStandardFooter: vi.fn().mockReturnValue(''), printHtml: vi.fn() } },
        { provide: CustomToastService, useValue: { showInfo: vi.fn(), showError: vi.fn() } },
        { provide: CustomerIdService, useValue: { customerId: vi.fn().mockReturnValue('1') } },
        { provide: DatePipe, useValue: { transform: vi.fn().mockReturnValue('2024-01-01') } },
      ],
    });
    service = TestBed.inject(PdfGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show info toast when generating solicitud pago', () => {
    const toast = TestBed.inject(CustomToastService);
    service.generateSolicitudPagoPdf('oc-1');
    expect(toast.showInfo).toHaveBeenCalled();
  });
});
