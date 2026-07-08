import { TestBed } from "@angular/core/testing";
import { MobileVirtualScroller } from "./virtual-scroller";

describe("MobileVirtualScroller (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileVirtualScroller] });
    expect(TestBed.createComponent(MobileVirtualScroller).componentInstance).toBeTruthy();
  });
});
