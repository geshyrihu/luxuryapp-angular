import { StripTagsPipe } from './StripTags.pipe';

describe('StripTagsPipe', () => {
  const pipe = new StripTagsPipe();

  it('should strip basic HTML tags', () => {
    expect(pipe.transform('<p>Hola</p>')).toBe('Hola');
  });

  it('should strip HTML with attributes', () => {
    expect(pipe.transform('<div class="test">Texto</div>')).toBe('Texto');
  });

  it('should return original text when no HTML', () => {
    expect(pipe.transform('Hola mundo')).toBe('Hola mundo');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should strip multiple nested tags', () => {
    expect(pipe.transform('<div><p><b>Texto</b></p></div>')).toBe('Texto');
  });
});
