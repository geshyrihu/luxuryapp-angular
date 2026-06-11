import { TestBed } from '@angular/core/testing';
import { ChartGeneratorService } from './chart-generator.service';

describe('ChartGeneratorService', () => {
  let service: ChartGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartGeneratorService],
    });
    service = TestBed.inject(ChartGeneratorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
