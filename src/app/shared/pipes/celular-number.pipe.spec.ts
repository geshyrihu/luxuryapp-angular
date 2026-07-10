import { CelularNumberPipe } from './celular-number.pipe';

describe('CelularNumberPipe', () => {
  const pipe = new CelularNumberPipe();

  it('should format 9 digits as XX-XXXX-XXX', () => {
    expect(pipe.transform('551234567')).toBe('55-1234-567');
  });

  it('should strip non-digit characters', () => {
    expect(pipe.transform('55-1234-567')).toBe('55-1234-567');
  });

  it('should return original value if not 9 digits', () => {
    expect(pipe.transform('12345')).toBe('12345');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });
});
