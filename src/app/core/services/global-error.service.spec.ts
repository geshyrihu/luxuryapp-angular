import { TestBed } from '@angular/core/testing';
import { GlobalErrorService } from './global-error.service';

describe('GlobalErrorService', () => {
  let service: GlobalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorService],
    });
    service = TestBed.inject(GlobalErrorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
