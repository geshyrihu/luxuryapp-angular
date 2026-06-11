import { TestBed } from '@angular/core/testing';
import { TableScrollHeightService } from './table-scroll-height.service';

describe('TableScrollHeightService', () => {
  let service: TableScrollHeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableScrollHeightService],
    });
    service = TestBed.inject(TableScrollHeightService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
