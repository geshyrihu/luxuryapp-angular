import { TestBed } from "@angular/core/testing";
import { MobileTerminal } from "./terminal";

describe("MobileTerminal (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTerminal] });
    expect(TestBed.createComponent(MobileTerminal).componentInstance).toBeTruthy();
  });
});
