import { ETipoGastoPipe } from './tipo-gasto.pipe';

vi.mock('src/app/core/helpers/enumeration', () => ({
  onGetSelectItemFromEnum: () => [
    { value: 1, label: 'Ordinario' },
    { value: 2, label: 'Extraordinario' },
  ],
}));

describe('ETipoGastoPipe', () => {
  const pipe = new ETipoGastoPipe();

  it('should return label for valid value', () => {
    expect(pipe.transform(1)).toBe('Ordinario');
    expect(pipe.transform(2)).toBe('Extraordinario');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for unknown value', () => {
    expect(pipe.transform(99)).toBe('');
  });
});
