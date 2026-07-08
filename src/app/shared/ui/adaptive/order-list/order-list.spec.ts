import { TestBed } from "@angular/core/testing";
import { LxOrderList } from "./order-list";

describe("LxOrderList (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxOrderList] });
    expect(TestBed.createComponent(LxOrderList).componentInstance).toBeTruthy();
  });
});
