import { TestBed } from "@angular/core/testing";
import { LxKnob } from "./knob";

describe("LxKnob (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxKnob] });
    expect(TestBed.createComponent(LxKnob).componentInstance).toBeTruthy();
  });
});
