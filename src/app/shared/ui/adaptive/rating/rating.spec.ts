import { TestBed } from "@angular/core/testing";
import { LxRating } from "./rating";

describe("LxRating (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxRating] });
    expect(TestBed.createComponent(LxRating).componentInstance).toBeTruthy();
  });
});
