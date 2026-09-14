import { TestBed } from '@angular/core/testing';
import { HtmlPrintService } from 'src/app/core/services/html-print.service';
import { EquipmentInspectionQrPrintService } from './equipment-inspection-qr-print.service';

describe('EquipmentInspectionQrPrintService', () => {
  let service: EquipmentInspectionQrPrintService;

  const mockHtmlPrintService = {
    printHtml: vi.fn(),
    esc: vi.fn((s: string) => s),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EquipmentInspectionQrPrintService,
        { provide: HtmlPrintService, useValue: mockHtmlPrintService },
      ],
    });

    service = TestBed.inject(EquipmentInspectionQrPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have printMany method', () => {
    expect(typeof service.printMany).toBe('function');
  });

  it('should have printOne method', () => {
    expect(typeof service.printOne).toBe('function');
  });
});
