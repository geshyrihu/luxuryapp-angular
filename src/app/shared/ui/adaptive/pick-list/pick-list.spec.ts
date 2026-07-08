import { TestBed } from "@angular/core/testing";
import { LxPickList } from "./pick-list";

describe("LxPickList (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxPickList] });
    expect(TestBed.createComponent(LxPickList).componentInstance).toBeTruthy();
  });
});
