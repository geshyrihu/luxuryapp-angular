import { CurrencyMexicoPipe } from './currencyMexico.pipe';

describe('CurrencyMexicoPipe', () => {
  const pipe = new CurrencyMexicoPipe();

  it('should format integer as MXN currency', () => {
    const result = pipe.transform(1000);
    expect(result).toMatch(/\$1,000\.00/);
  });

  it('should format decimal as MXN currency', () => {
    const result = pipe.transform(1234.56);
    expect(result).toMatch(/\$1,234\.56/);
  });

  it('should format zero', () => {
    const result = pipe.transform(0);
    expect(result).toMatch(/\$0\.00/);
  });

  it('should return empty string for NaN', () => {
    expect(pipe.transform(NaN)).toBe('');
  });

  it('should format large numbers', () => {
    const result = pipe.transform(1000000);
    expect(result).toContain('$');
    expect(result).toContain('1,000,000');
  });
});
