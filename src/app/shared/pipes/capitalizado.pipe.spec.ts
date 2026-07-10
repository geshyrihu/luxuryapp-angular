import { CapitalizadoPipe } from './capitalizado.pipe';

describe('CapitalizadoPipe', () => {
  const pipe = new CapitalizadoPipe();

  it('should capitalize each word when todas=true', () => {
    expect(pipe.transform('hola mundo')).toBe('Hola Mundo');
  });

  it('should capitalize only first word when todas=false', () => {
    expect(pipe.transform('hola mundo', false)).toBe('Hola mundo');
  });

  it('should default to todas=true', () => {
    expect(pipe.transform('foo bar baz')).toBe('Foo Bar Baz');
  });

  it('should handle single word', () => {
    expect(pipe.transform('hola')).toBe('Hola');
  });

  it('should handle empty string gracefully', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle lowercase input', () => {
    expect(pipe.transform('juan perez')).toBe('Juan Perez');
  });

  it('should handle mixed case input', () => {
    expect(pipe.transform('jUAN PEREZ')).toBe('Juan Perez');
  });
});
