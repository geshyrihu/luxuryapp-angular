import { TestBed } from "@angular/core/testing";
import { LxVirtualScroller } from "./virtual-scroller";

describe("LxVirtualScroller (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxVirtualScroller] });
    expect(TestBed.createComponent(LxVirtualScroller).componentInstance).toBeTruthy();
  });
});
