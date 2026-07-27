import { Directive, input, model, output, computed } from "@angular/core";

export interface StepperStep {
  value: number;
  label: string;
  icon?: string;
}

@Directive()
export abstract class StepperBase {
  steps = input.required<StepperStep[]>();
  linear = input<boolean>(true);
  finishLabel = input("Finalizar");

  activeStep = model<number>(1);

  finish = output<void>();

  lastStep = computed<number>(() => {
    return this.steps().length;
  });

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
