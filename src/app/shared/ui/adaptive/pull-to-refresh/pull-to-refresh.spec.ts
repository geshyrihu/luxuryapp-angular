import { TestBed } from "@angular/core/testing";
import { LxPullToRefresh } from "./pull-to-refresh";

describe("LxPullToRefresh (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxPullToRefresh] });
    expect(TestBed.createComponent(LxPullToRefresh).componentInstance).toBeTruthy();
  });
});
