import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintableDirective } from './printable.directive';

@Component({
  selector: 'test-host-printable',
  template: `<button appPrintable id="print-btn">Print</button>`,
  imports: [PrintableDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestPrintableHostComponent {}

describe('PrintableDirective', () => {
  let fixture: ComponentFixture<TestPrintableHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestPrintableHostComponent],
    });
    fixture = TestBed.createComponent(TestPrintableHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.children[0].injector.get(PrintableDirective);
    expect(directive).toBeTruthy();
  });

  it('should call scrollIntoView and window.print on click', () => {
    vi.useFakeTimers();
    const directive = fixture.debugElement.children[0].injector.get(PrintableDirective);
    const el = fixture.nativeElement.querySelector('#print-btn');
    const scrollSpy = vi.fn();
    Object.defineProperty(el, 'scrollIntoView', { value: scrollSpy, configurable: true });
    const printSpy = vi.spyOn(window, 'print');

    directive.onPrint();

    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    vi.advanceTimersByTime(300);
    expect(printSpy).toHaveBeenCalled();

    printSpy.mockRestore();
    vi.useRealTimers();
  });
});
