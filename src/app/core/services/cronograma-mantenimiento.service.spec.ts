import { TestBed } from '@angular/core/testing';
import { CronogramaMantenimientoService } from './cronograma-mantenimiento.service';

describe('CronogramaMantenimientoService', () => {
  let service: CronogramaMantenimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CronogramaMantenimientoService],
    });
    service = TestBed.inject(CronogramaMantenimientoService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
