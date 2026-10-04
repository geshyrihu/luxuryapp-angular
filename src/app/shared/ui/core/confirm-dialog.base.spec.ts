import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ConfirmDialogBase } from "../core/confirm-dialog.base";

@Component({ selector: "test-confirm-dialog", template: "" })
class Host extends ConfirmDialogBase {}

describe("ConfirmDialogBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
