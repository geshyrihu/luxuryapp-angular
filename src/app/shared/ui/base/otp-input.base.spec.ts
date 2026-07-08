import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { OtpInputBase } from "./otp-input.base";

@Component({ selector: "test-otp-input", template: "" })
class Host extends OtpInputBase {}

describe("OtpInputBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
