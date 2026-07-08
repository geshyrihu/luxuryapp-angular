import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ConfirmDialogBase } from "./confirm-dialog.base";

@Component({ selector: "test-confirm-dialog", standalone: true, template: "" })
class Host extends ConfirmDialogBase {}

describe("ConfirmDialogBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
