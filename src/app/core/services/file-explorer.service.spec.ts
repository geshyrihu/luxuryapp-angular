import { TestBed } from '@angular/core/testing';
import { FileExplorerService } from './file-explorer.service';
import { ApiResponseService } from './api-response.service';

describe('FileExplorerService', () => {
  let service: FileExplorerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileExplorerService,
        { provide: ApiResponseService, useValue: {} },
      ],
    });
    service = TestBed.inject(FileExplorerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
