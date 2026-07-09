import { TestBed } from "@angular/core/testing";
import { LxSteps } from "./steps";

describe("LxSteps (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSteps] });
    expect(TestBed.createComponent(LxSteps).componentInstance).toBeTruthy();
  });
});
