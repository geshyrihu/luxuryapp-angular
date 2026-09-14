import { TestBed } from '@angular/core/testing';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService],
    });
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call downloadFile with correct filename pattern', () => {
    const spy = vi.spyOn(service, 'downloadFile');
    const blob = new Blob(['test'], { type: 'text/plain' });
    service.downloadFileWithTimestamp(blob, 'report', 'pdf', 'application/pdf');
    expect(spy).toHaveBeenCalled();
    const filename = spy.mock.calls[0][1] as string;
    expect(filename).toMatch(/^report_.*\.pdf$/);
  });
});
