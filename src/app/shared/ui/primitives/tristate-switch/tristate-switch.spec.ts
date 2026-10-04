import { TestBed } from "@angular/core/testing";
import { AppTristateSwitch } from "../../primitives/tristate-switch/tristate-switch";

describe("AppTristateSwitch", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [AppTristateSwitch] });
    expect(TestBed.createComponent(AppTristateSwitch).componentInstance).toBeTruthy();
  });
});
