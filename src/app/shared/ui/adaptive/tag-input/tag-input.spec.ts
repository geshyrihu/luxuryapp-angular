import { TestBed } from "@angular/core/testing";
import { LxTagInput } from "./tag-input";

describe("LxTagInput (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxTagInput] });
    expect(TestBed.createComponent(LxTagInput).componentInstance).toBeTruthy();
  });
});
