import { TestBed } from "@angular/core/testing";
import { LxSwipeActions } from "./swipe-actions";

describe("LxSwipeActions (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSwipeActions] });
    expect(TestBed.createComponent(LxSwipeActions).componentInstance).toBeTruthy();
  });
});
