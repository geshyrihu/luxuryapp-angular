import { TestBed } from '@angular/core/testing';
import { StatusSolicitudVacanteService } from './status-solicitud-vacante.service';

describe('StatusSolicitudVacanteService', () => {
  let service: StatusSolicitudVacanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusSolicitudVacanteService],
    });
    service = TestBed.inject(StatusSolicitudVacanteService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
