import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { VirtualScrollerBase } from "./virtual-scroller.base";

@Component({ selector: "test-virtual-scroller", template: "" })
class Host extends VirtualScrollerBase {}

describe("VirtualScrollerBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
