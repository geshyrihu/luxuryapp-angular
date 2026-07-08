import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ConfirmPopupBase } from "./confirm-popup.base";

@Component({ selector: "test-confirm-popup", template: "" })
class Host extends ConfirmPopupBase {}

describe("ConfirmPopupBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
