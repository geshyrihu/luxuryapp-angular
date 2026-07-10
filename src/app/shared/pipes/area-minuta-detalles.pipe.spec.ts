import { EAreaMinutasDetallesPipe } from './area-minuta-detalles.pipe';

vi.mock('src/app/core/helpers/enumeration', () => ({
  onGetSelectItemFromEnum: () => [
    { value: 'Administracion', label: 'Administración' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
  ],
}));

describe('EAreaMinutasDetallesPipe', () => {
  const pipe = new EAreaMinutasDetallesPipe();

  it('should return label for valid value', () => {
    expect(pipe.transform('Administracion')).toBe('Administración');
    expect(pipe.transform('Mantenimiento')).toBe('Mantenimiento');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for unknown value', () => {
    expect(pipe.transform('Inexistente')).toBe('');
  });
});
