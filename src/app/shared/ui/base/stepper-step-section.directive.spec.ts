import { ChangeDetectionStrategy, Component, ViewChild, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperStepSection } from './stepper-step-section.directive';

@Component({
  selector: 'test-host-stepper-step-section',
  template: `<section step="1" id="step-1">Step 1</section>
             <section step="2" id="step-2">Step 2</section>`,
  imports: [StepperStepSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestStepperHostComponent {
  @ViewChild(StepperStepSection, { static: true }) firstStep!: StepperStepSection;
}

describe('StepperStepSection', () => {
  let fixture: ComponentFixture<TestStepperHostComponent>;
  let component: TestStepperHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestStepperHostComponent],
    });
    fixture = TestBed.createComponent(TestStepperHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create instance', () => {
    expect(component.firstStep).toBeTruthy();
  });

  it('should set display block when setActive(true)', () => {
    component.firstStep.setActive(true);
    const el = fixture.nativeElement.querySelector('#step-1');
    expect(el.style.display).toBe('block');
  });

  it('should set display none when setActive(false)', () => {
    component.firstStep.setActive(false);
    const el = fixture.nativeElement.querySelector('#step-1');
    expect(el.style.display).toBe('none');
  });

  it('should have step input set', () => {
    expect(component.firstStep.step).toBe('1');
  });
});
