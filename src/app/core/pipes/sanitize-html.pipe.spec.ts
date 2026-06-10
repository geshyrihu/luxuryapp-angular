import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SanitizeHtmlPipe],
    });
    pipe = TestBed.inject(SanitizeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should strip HTML tags from string', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('<p>Test</p>');
    expect(spy).toHaveBeenCalledWith('Test');
  });

  it('should return safe HTML type', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('Hola');
    expect(spy).toHaveBeenCalledWith('Hola');
  });

  it('should return empty for null input', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform(null);
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should return empty for undefined input', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform(undefined);
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should handle complex HTML', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('<div class="x"><b>Texto</b></div>');
    expect(spy).toHaveBeenCalledWith('Texto');
  });

  it('should bypass security trust on result', () => {
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('<p>test</p>');
    expect(spy).toHaveBeenCalledWith('test');
  });
});
