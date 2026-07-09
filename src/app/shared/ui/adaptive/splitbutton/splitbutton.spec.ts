import { TestBed } from "@angular/core/testing";
import { LxSplitbutton } from "./splitbutton";

describe("LxSplitbutton (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSplitbutton] });
    expect(TestBed.createComponent(LxSplitbutton).componentInstance).toBeTruthy();
  });
});
