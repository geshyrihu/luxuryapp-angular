import { TestBed } from "@angular/core/testing";
import { LxPanelMenu } from "./panel-menu";

describe("LxPanelMenu (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxPanelMenu] });
    expect(TestBed.createComponent(LxPanelMenu).componentInstance).toBeTruthy();
  });
});
