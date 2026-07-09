import { TestBed } from "@angular/core/testing";
import { LxSplitButton } from "./split-button";

describe("LxSplitButton (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSplitButton] });
    expect(TestBed.createComponent(LxSplitButton).componentInstance).toBeTruthy();
  });
});
