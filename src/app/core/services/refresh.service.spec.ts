import { TestBed } from '@angular/core/testing';
import { RefreshService } from './refresh.service';

describe('RefreshService', () => {
  let service: RefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshService],
    });
    service = TestBed.inject(RefreshService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
