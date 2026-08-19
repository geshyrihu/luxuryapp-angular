import {
  AfterContentInit,
  ContentChildren,
  Directive,
  effect,
  input,
  model,
  output,
  computed,
  QueryList,
} from "@angular/core";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import { StepperStepSection } from "./stepper-step-section.directive";

export interface StepperStep {
  value: number;
  label: string;
  icon?: AppIconName;
}

@Directive()
export abstract class StepperBase implements AfterContentInit {
  steps = input.required<StepperStep[]>();
  linear = input<boolean>(true);
  finishLabel = input("Finalizar");

  activeStep = model<number>(1);

  finish = output<void>();

  @ContentChildren(StepperStepSection)
  private stepSections?: QueryList<StepperStepSection>;

  lastStep = computed<number>(() => {
    return this.steps().length;
  });

  constructor() {
    effect(() => this.applyActiveStep(this.activeStep()));
  }

  ngAfterContentInit(): void {
    this.applyActiveStep(this.activeStep());
    this.stepSections?.changes.subscribe(() =>
      this.applyActiveStep(this.activeStep()),
    );
  }

  private applyActiveStep(active: number): void {
    this.stepSections?.forEach((section) =>
      section.setActive(Number(section.step) === active),
    );
  }

  next(): void {
    const next = this.activeStep() + 1;
    if (next <= this.lastStep()) {
      this.activeStep.set(next);
    }
  }

  previous(): void {
    const prev = this.activeStep() - 1;
    if (prev >= 1) {
      this.activeStep.set(prev);
    }
  }
}
