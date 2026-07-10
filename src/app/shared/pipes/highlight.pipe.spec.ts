import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightPipe],
    });
    pipe = TestBed.inject(HighlightPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should wrap search term in mark tags', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('Hola mundo', 'mundo');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('<mark>mundo</mark>'),
    );
  });

  it('should return original value when no search term', () => {
    const result = pipe.transform('Hola mundo', '');
    expect(result).toBe('Hola mundo');
  });

  it('should return original value when search is null/undefined', () => {
    expect(pipe.transform('Hola mundo', null as any)).toBe('Hola mundo');
    expect(pipe.transform('Hola mundo', undefined as any)).toBe('Hola mundo');
  });

  it('should return empty if value is empty', () => {
    expect(pipe.transform('', 'test')).toBe('');
  });

  it('should handle multiple search terms', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('Hola mundo foo', 'mundo foo');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('<mark>mundo</mark>'),
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('<mark>foo</mark>'),
    );
  });

  it('should normalize accents for matching', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('canción', 'cancion');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('<mark>canción</mark>'),
    );
  });

  it('should preserve original HTML structure', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('<b>Hola</b> mundo', 'mundo');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('<b>Hola</b>'),
    );
  });
});
