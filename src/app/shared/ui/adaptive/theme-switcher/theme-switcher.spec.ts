import { TestBed } from "@angular/core/testing";
import { LxThemeSwitcher } from "./theme-switcher";

describe("LxThemeSwitcher (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxThemeSwitcher] });
    expect(TestBed.createComponent(LxThemeSwitcher).componentInstance).toBeTruthy();
  });
});
