import { InitialsAbbrPipe } from './initials-abbr.pipe';

describe('InitialsAbbrPipe', () => {
  const pipe = new InitialsAbbrPipe();

  it('should return initials from full name', () => {
    expect(pipe.transform('Juan Perez Lopez')).toBe('JPL');
  });

  it('should return single initial for one word', () => {
    expect(pipe.transform('Juan')).toBe('J');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should handle multiple spaces', () => {
    expect(pipe.transform('Juan  Perez')).toBe('JP');
  });

  it('should uppercase initials', () => {
    expect(pipe.transform('juan perez')).toBe('JP');
  });
});
