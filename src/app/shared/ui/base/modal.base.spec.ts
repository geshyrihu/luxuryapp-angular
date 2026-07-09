import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ModalBase } from "./modal.base";

@Component({ selector: "test-modal", template: "" })
class Host extends ModalBase {}

describe("ModalBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
