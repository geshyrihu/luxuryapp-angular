import { vi } from 'vitest';
import { SUPERVISION_MODULES } from './supervision-modules';

describe('SUPERVISION_MODULES', () => {
  it('should be defined and have groups', () => {
    expect(SUPERVISION_MODULES).toBeDefined();
    expect(SUPERVISION_MODULES.length).toBeGreaterThan(0);
  });

  it('should have Agenda y Minutas group', () => {
    const agendaGroup = SUPERVISION_MODULES.find(
      (g) => g.label === 'Agenda y Minutas',
    );
    expect(agendaGroup).toBeDefined();
    expect(agendaGroup!.cards.length).toBeGreaterThan(0);
  });

  it('should have Resultados y Reportes group', () => {
    const resultadosGroup = SUPERVISION_MODULES.find(
      (g) => g.label === 'Resultados y Reportes',
    );
    expect(resultadosGroup).toBeDefined();
    expect(resultadosGroup!.cards.length).toBe(6);
  });

  it('each card should have required properties', () => {
    for (const group of SUPERVISION_MODULES) {
      for (const card of group.cards) {
        expect(card.title).toBeDefined();
        expect(card.route).toBeDefined();
        expect(card.icon).toBeDefined();
        expect(card.color).toBeDefined();
        expect(card.bgColor).toBeDefined();
      }
    }
  });
});
