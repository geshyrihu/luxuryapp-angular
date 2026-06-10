import { vi } from 'vitest';
import { SupervisionModuleCard, SupervisionModuleGroup } from './supervision-module.model';

describe('SupervisionModuleCard / SupervisionModuleGroup', () => {
  it('should define valid interfaces (type-check only)', () => {
    const card: SupervisionModuleCard = {
      title: 'Test',
      description: 'Desc',
      route: '/test',
      icon: 'mdi:test',
      color: '#000',
      bgColor: '#fff',
    };
    expect(card.title).toBe('Test');
    expect(card.route).toBe('/test');

    const group: SupervisionModuleGroup = {
      label: 'Group',
      icon: 'mdi:group',
      cards: [card],
    };
    expect(group.label).toBe('Group');
    expect(group.cards.length).toBe(1);
    expect(group.cards[0]).toBe(card);
  });
});
