import { TestBed } from '@angular/core/testing';
import { ProfielService } from './profiel.service';

describe('ProfielService', () => {
  let service: ProfielService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfielService],
    });
    service = TestBed.inject(ProfielService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
