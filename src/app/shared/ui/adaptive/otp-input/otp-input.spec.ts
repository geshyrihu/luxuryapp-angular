import { TestBed } from "@angular/core/testing";
import { LxOtpInput } from "./otp-input";

describe("LxOtpInput (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxOtpInput] });
    expect(TestBed.createComponent(LxOtpInput).componentInstance).toBeTruthy();
  });
});
