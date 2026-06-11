import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HtmlPrintService } from './html-print.service';
import { CustomerIdService } from './customer-id.service';

describe('HtmlPrintService', () => {
  let service: HtmlPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HtmlPrintService,
        { provide: CustomerIdService, useValue: { customerName: vi.fn(), nombreCorto: vi.fn(), customerPhotoPath: vi.fn() } },
      ],
    });
    service = TestBed.inject(HtmlPrintService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
