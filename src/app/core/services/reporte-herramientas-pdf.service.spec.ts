import { TestBed } from '@angular/core/testing';
import { ReporteHerramientasPdfService } from './reporte-herramientas-pdf.service';

describe('ReporteHerramientasPdfService', () => {
  let service: ReporteHerramientasPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteHerramientasPdfService],
    });
    service = TestBed.inject(ReporteHerramientasPdfService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
