import { TestBed } from "@angular/core/testing";
import { LxSlider } from "./slider";

describe("LxSlider (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSlider] });
    expect(TestBed.createComponent(LxSlider).componentInstance).toBeTruthy();
  });
});
