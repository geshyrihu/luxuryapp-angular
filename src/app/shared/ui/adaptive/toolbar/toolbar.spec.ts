import { TestBed } from "@angular/core/testing";
import { LxToolbar } from "./toolbar";

describe("LxToolbar (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxToolbar] });
    expect(TestBed.createComponent(LxToolbar).componentInstance).toBeTruthy();
  });
});
