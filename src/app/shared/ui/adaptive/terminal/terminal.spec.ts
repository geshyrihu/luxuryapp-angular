import { TestBed } from "@angular/core/testing";
import { LxTerminal } from "./terminal";

describe("LxTerminal (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxTerminal] });
    expect(TestBed.createComponent(LxTerminal).componentInstance).toBeTruthy();
  });
});
