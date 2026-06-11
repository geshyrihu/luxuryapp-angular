import { TestBed } from '@angular/core/testing';
import { ResultadoGeneralService } from './resultado-general.service';

describe('ResultadoGeneralService', () => {
  let service: ResultadoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultadoGeneralService],
    });
    service = TestBed.inject(ResultadoGeneralService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
