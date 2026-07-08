import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { StepperBase, StepperStep } from "./stepper.base";

@Component({ selector: "test-stepper", standalone: true, template: "" })
class TestStepper extends StepperBase {}

const steps: StepperStep[] = [
  { value: 1, label: "Uno" },
  { value: 2, label: "Dos" },
  { value: 3, label: "Tres" },
];

describe("StepperBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestStepper] });
    const f = TestBed.createComponent(TestStepper);
    f.componentRef.setInput("steps", steps);
    return f;
  }

  it("lastStep reflects steps length", () => {
    expect(make().componentInstance.lastStep).toBe(3);
  });

  it("next advances but clamps at last", () => {
    const c = make().componentInstance;
    c.next();
    expect(c.activeStep()).toBe(2);
    c.next();
    c.next();
    expect(c.activeStep()).toBe(3);
  });

  it("previous goes back but clamps at 1", () => {
    const c = make().componentInstance;
    c.activeStep.set(2);
    c.previous();
    expect(c.activeStep()).toBe(1);
    c.previous();
    expect(c.activeStep()).toBe(1);
  });
});
