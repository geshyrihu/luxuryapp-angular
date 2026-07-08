import { TestBed } from "@angular/core/testing";
import { MobileThemeSwitcher } from "./theme-switcher";

describe("MobileThemeSwitcher (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileThemeSwitcher] });
    expect(TestBed.createComponent(MobileThemeSwitcher).componentInstance).toBeTruthy();
  });
});
