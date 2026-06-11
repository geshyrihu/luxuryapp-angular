import { TestBed } from '@angular/core/testing';
import { ConsoleLoggerService } from './console-logger.service';

describe('ConsoleLoggerService', () => {
  let service: ConsoleLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsoleLoggerService],
    });
    service = TestBed.inject(ConsoleLoggerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
