import { TestBed } from "@angular/core/testing";
import { LxMultiselect } from "./multiselect";

describe("LxMultiselect (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxMultiselect] });
    expect(TestBed.createComponent(LxMultiselect).componentInstance).toBeTruthy();
  });
});
