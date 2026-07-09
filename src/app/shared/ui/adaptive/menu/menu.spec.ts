import { TestBed } from "@angular/core/testing";
import { LxMenu } from "./menu";

describe("LxMenu (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxMenu] });
    expect(TestBed.createComponent(LxMenu).componentInstance).toBeTruthy();
  });
});
