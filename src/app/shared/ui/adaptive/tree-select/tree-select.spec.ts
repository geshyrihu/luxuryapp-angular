import { TestBed } from "@angular/core/testing";
import { LxTreeSelect } from "./tree-select";

describe("LxTreeSelect (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxTreeSelect] });
    expect(TestBed.createComponent(LxTreeSelect).componentInstance).toBeTruthy();
  });
});
