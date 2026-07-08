import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { GlobalErrorAlertBase } from "./global-error-alert.base";

@Component({ selector: "test-global-error-alert", template: "" })
class Host extends GlobalErrorAlertBase {}

describe("GlobalErrorAlertBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
