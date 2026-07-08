import { TestBed } from "@angular/core/testing";
import { LxScrollTop } from "./tap-to-top";

describe("LxScrollTop (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxScrollTop] });
    expect(TestBed.createComponent(LxScrollTop).componentInstance).toBeTruthy();
  });
});
