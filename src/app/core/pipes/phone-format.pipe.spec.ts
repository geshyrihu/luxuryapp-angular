import { PhoneFormatPipe } from './phone-format.pipe';

describe('PhoneFormatPipe', () => {
  const pipe = new PhoneFormatPipe();

  it('should format 10 digits as (XX) XXXX-XXXX', () => {
    expect(pipe.transform('5512345678')).toBe('(55) 1234-5678');
  });

  it('should strip non-digit characters', () => {
    expect(pipe.transform('55-1234-5678')).toBe('(55) 1234-5678');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return formatted value for numbers with less digits', () => {
    const result = pipe.transform('55123');
    expect(result).toMatch(/^\(55\) 123-/);
  });
});
