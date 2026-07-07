import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutosizeDirective } from './autosize-text-area.directive';

@Component({
  template: `<textarea appAutosize></textarea>`,
  imports: [AutosizeDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
class TestHostComponent {}

describe('AutosizeDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let textarea: HTMLTextAreaElement;
  let directive: AutosizeDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    directive = fixture.debugElement.children[0].injector.get(AutosizeDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should resize textarea on input event', () => {
    const spy = vi.spyOn(directive, 'resize');
    textarea.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalled();
  });

  it('should set height to scrollHeight on resize', () => {
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => 100,
    });

    directive.resize();

    expect(textarea.style.height).toBe('100px');
  });

  it('should set height to 0 before recalculating', () => {
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => 50,
    });

    textarea.style.height = '200px';
    directive.resize();

    expect(textarea.style.height).toBe('50px');
  });

  it('should call resize on init if scrollHeight exists', () => {
    vi.useFakeTimers();
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => 75,
    });

    const spy = vi.spyOn(directive, 'resize');
    directive.ngOnInit();
    vi.advanceTimersByTime(1);

    expect(spy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should not call resize on init if scrollHeight is 0', () => {
    vi.useFakeTimers();
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => 0,
    });

    const spy = vi.spyOn(directive, 'resize');
    directive.ngOnInit();
    vi.advanceTimersByTime(1);

    expect(spy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
