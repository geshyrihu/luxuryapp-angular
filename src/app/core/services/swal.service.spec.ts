import { TestBed } from '@angular/core/testing';
import { SwalService } from './swal.service';

describe('SwalService', () => {
  let service: SwalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwalService],
    });
    service = TestBed.inject(SwalService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
