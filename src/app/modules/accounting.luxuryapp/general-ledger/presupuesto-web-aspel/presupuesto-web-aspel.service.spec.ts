import { TestBed } from '@angular/core/testing';
import { PresupuestoWebAspelService } from './presupuesto-web-aspel.service';

describe('PresupuestoWebAspelService', () => {
  let service: PresupuestoWebAspelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PresupuestoWebAspelService],
    });
    service = TestBed.inject(PresupuestoWebAspelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle mes', () => {
    const initialLength = service.mesesSeleccionados().length;
    service.toggleMes(service.months[0]);
    expect(service.mesesSeleccionados().length).toBe(initialLength - 1);
  });
});
