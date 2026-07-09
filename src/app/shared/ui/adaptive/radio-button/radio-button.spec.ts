import { TestBed } from "@angular/core/testing";
import { LxRadioButton } from "./radio-button";

describe("LxRadioButton (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxRadioButton] });
    expect(TestBed.createComponent(LxRadioButton).componentInstance).toBeTruthy();
  });
});
