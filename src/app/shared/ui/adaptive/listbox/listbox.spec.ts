import { TestBed } from "@angular/core/testing";
import { LxListbox } from "./listbox";

describe("LxListbox (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxListbox] });
    expect(TestBed.createComponent(LxListbox).componentInstance).toBeTruthy();
  });
});
