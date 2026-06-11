import { TestBed } from '@angular/core/testing';
import { ReporteOrdenesServicioService } from './reporte-ordenes-servicio.service';

describe('ReporteOrdenesServicioService', () => {
  let service: ReporteOrdenesServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteOrdenesServicioService],
    });
    service = TestBed.inject(ReporteOrdenesServicioService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
