import { TestBed } from "@angular/core/testing";
import { LxStepper } from "./stepper";

describe("LxStepper (render)", () => {
  it("compiles wizard (web) + mobile branches and renders", () => {
    TestBed.configureTestingModule({ imports: [LxStepper] });
    const fixture = TestBed.createComponent(LxStepper);
    fixture.componentRef.setInput("steps", [
      { value: 1, label: "Datos", icon: "material-symbols-light:person" },
      { value: 2, label: "Confirmar", icon: "material-symbols-light:check" },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
