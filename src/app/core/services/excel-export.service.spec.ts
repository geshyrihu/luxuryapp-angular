import { TestBed } from '@angular/core/testing';
import { ExcelExportService } from './excel-export.service';
import { ExportService } from './export.service';

describe('ExcelExportService', () => {
  let service: ExcelExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExcelExportService,
        { provide: ExportService, useValue: { downloadFileWithTimestamp: vi.fn() } },
      ],
    });
    service = TestBed.inject(ExcelExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call exportService.downloadFileWithTimestamp', async () => {
    const exportService = TestBed.inject(ExportService);
    service.exportToExcel(
      [{ name: 'Alice' }, { name: 'Bob' }],
      [{ header: 'Name', key: 'name', width: 20 }],
      'Sheet1',
      'test-export'
    );
    await vi.waitFor(() => {
      expect(exportService.downloadFileWithTimestamp).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
});
