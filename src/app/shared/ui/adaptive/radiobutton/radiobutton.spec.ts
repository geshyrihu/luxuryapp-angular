import { TestBed } from "@angular/core/testing";
import { LxRadiobutton } from "./radiobutton";

describe("LxRadiobutton (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxRadiobutton] });
    expect(TestBed.createComponent(LxRadiobutton).componentInstance).toBeTruthy();
  });
});
