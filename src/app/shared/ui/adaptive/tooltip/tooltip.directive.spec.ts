import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxTooltipDirective } from './tooltip.directive';

@Component({
  selector: 'test-host-tooltip',
  template: `<div lxTooltip="Hello" id="tooltip-host">Content</div>`,
  imports: [LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestTooltipHostComponent {}

describe('LxTooltipDirective', () => {
  let fixture: ComponentFixture<TestTooltipHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestTooltipHostComponent],
    });
    fixture = TestBed.createComponent(TestTooltipHostComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.children[0].injector.get(LxTooltipDirective);
    expect(directive).toBeTruthy();
  });

  it('should render host element with tooltip directive', () => {
    const el = fixture.nativeElement.querySelector('#tooltip-host');
    expect(el).toBeTruthy();
  });
});
