import { TestBed } from '@angular/core/testing';
import { WorkSchedulePresentationService } from './work-schedule-presentation.service';

describe('WorkSchedulePresentationService', () => {
  let service: WorkSchedulePresentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkSchedulePresentationService],
    });
    service = TestBed.inject(WorkSchedulePresentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 7 indicators', () => {
    const result = service.indicators({ diasDeTrabajo: [] });
    expect(result.length).toBe(7);
  });

  it('should calculate weekly average hours', () => {
    const result = service.weeklyAverageHours({
      diasDeTrabajo: [
        { diaSemana: 1, numeroSemanaCiclo: 1, horaEntrada: '08:00', horaSalida: '16:00', esDescanso: false },
        { diaSemana: 2, numeroSemanaCiclo: 1, horaEntrada: '08:00', horaSalida: '16:00', esDescanso: false },
        { diaSemana: 3, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 4, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 5, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 6, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 0, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
      ],
    });
    expect(result).toBe(16);
  });

  it('should format hours summary string', () => {
    const result = service.hoursSummary({
      diasDeTrabajo: [
        { diaSemana: 1, numeroSemanaCiclo: 1, horaEntrada: '09:00', horaSalida: '17:00', esDescanso: false },
        { diaSemana: 2, numeroSemanaCiclo: 1, horaEntrada: '09:00', horaSalida: '17:00', esDescanso: false },
        { diaSemana: 3, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 4, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 5, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 6, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
        { diaSemana: 0, numeroSemanaCiclo: 1, horaEntrada: null, horaSalida: null, esDescanso: true },
      ],
    });
    expect(result).toContain('Sem:');
    expect(result).toContain('Quin:');
    expect(result).toContain('4 sem:');
  });
});
