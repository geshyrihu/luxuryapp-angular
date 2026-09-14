import { TestBed } from '@angular/core/testing';
import { FundingExcelExportService } from './funding-excel-export.service';

describe('FundingExcelExportService', () => {
  let service: FundingExcelExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FundingExcelExportService],
    });
    service = TestBed.inject(FundingExcelExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle null DTO gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await service.exportToExcel(null as any);
    expect(consoleSpy).toHaveBeenCalledWith('No data provided for Excel export.');
    consoleSpy.mockRestore();
  });
});
