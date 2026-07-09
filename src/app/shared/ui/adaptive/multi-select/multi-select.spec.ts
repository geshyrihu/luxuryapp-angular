import { TestBed } from "@angular/core/testing";
import { LxMultiSelect } from "./multi-select";

describe("LxMultiSelect (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxMultiSelect] });
    expect(TestBed.createComponent(LxMultiSelect).componentInstance).toBeTruthy();
  });
});
