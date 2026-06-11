import { TestBed } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('PrintService', () => {
  let service: PrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintService],
    });
    service = TestBed.inject(PrintService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
