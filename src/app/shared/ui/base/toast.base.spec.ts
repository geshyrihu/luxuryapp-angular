import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ToastBase } from "./toast.base";

@Component({ selector: "test-toast", standalone: true, template: "" })
class Host extends ToastBase {}

describe("ToastBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
