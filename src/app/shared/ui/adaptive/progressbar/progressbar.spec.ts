import { TestBed } from "@angular/core/testing";
import { LxProgressbar } from "./progressbar";

describe("LxProgressbar (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxProgressbar] });
    expect(TestBed.createComponent(LxProgressbar).componentInstance).toBeTruthy();
  });
});
