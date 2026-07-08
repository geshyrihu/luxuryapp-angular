import { TestBed } from "@angular/core/testing";
import { LxTree } from "./tree";

describe("LxTree (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxTree] });
    expect(TestBed.createComponent(LxTree).componentInstance).toBeTruthy();
  });
});
