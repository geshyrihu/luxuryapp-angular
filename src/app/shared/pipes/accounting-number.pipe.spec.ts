import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { AccountingNumberPipe } from './accounting-number.pipe';

registerLocaleData(localeEsMx);

describe('AccountingNumberPipe', () => {
  const pipe = new AccountingNumberPipe();

  it('should format positive integer with default digitsInfo', () => {
    const result = pipe.transform(1000);
    expect(result).toBe('1,000');
  });

  it('should format positive decimal with custom digitsInfo', () => {
    const result = pipe.transform(1234.56, '1.2-2');
    expect(result).toBe('1,234.56');
  });

  it('should render zero as dash', () => {
    const result = pipe.transform(0);
    expect(result).toBe('-');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should wrap negative values in parentheses', () => {
    const result = pipe.transform(-500);
    expect(result).toBe('(500)');
  });

  it('should format negative decimal in parentheses', () => {
    const result = pipe.transform(-1234.56, '1.2-2');
    expect(result).toBe('(1,234.56)');
  });

  it('should format large numbers', () => {
    const result = pipe.transform(1000000);
    expect(result).toContain('1,000,000');
  });
});
