import { TestBed } from "@angular/core/testing";
import { LxTimeline } from "./timeline";

describe("LxTimeline (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxTimeline] });
    expect(TestBed.createComponent(LxTimeline).componentInstance).toBeTruthy();
  });
});
