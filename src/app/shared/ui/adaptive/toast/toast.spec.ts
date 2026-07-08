import { TestBed } from "@angular/core/testing";
import { LxToast } from "./toast";

describe("LxToast (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxToast] });
    expect(TestBed.createComponent(LxToast).componentInstance).toBeTruthy();
  });
});
