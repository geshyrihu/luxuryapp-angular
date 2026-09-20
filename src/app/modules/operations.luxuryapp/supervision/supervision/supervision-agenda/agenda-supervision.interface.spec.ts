import { vi } from 'vitest';
import { IAgendaSupervisionForm } from './agenda-supervision.interface';

describe('IAgendaSupervisionForm', () => {
  it('should be a valid interface (type-check only)', () => {
    const mockForm: Pick<
      IAgendaSupervisionForm,
      'id' | 'fechaSolicitud' | 'customerId' | 'problema' | 'solucion' | 'fechaConclusion' | 'applicationUserId'
    > = {
      id: {} as any,
      fechaSolicitud: {} as any,
      customerId: {} as any,
      problema: {} as any,
      solucion: {} as any,
      fechaConclusion: {} as any,
      applicationUserId: {} as any,
    };
    expect(mockForm).toBeDefined();
    expect(Object.keys(mockForm).length).toBe(7);
  });
});
