import { TestBed } from "@angular/core/testing";
import { LxSkeleton } from "./skeleton";

describe("LxSkeleton (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSkeleton] });
    expect(TestBed.createComponent(LxSkeleton).componentInstance).toBeTruthy();
  });
});
