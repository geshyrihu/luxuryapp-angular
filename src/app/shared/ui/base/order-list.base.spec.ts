import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { OrderListBase } from "./order-list.base";

@Component({ selector: "test-order-list", template: "" })
class Host extends OrderListBase {}

describe("OrderListBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
