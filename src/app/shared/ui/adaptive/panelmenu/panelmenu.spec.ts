import { TestBed } from "@angular/core/testing";
import { LxPanelmenu } from "./panelmenu";

describe("LxPanelmenu (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxPanelmenu] });
    expect(TestBed.createComponent(LxPanelmenu).componentInstance).toBeTruthy();
  });
});
