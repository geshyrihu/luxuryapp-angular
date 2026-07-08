import { TestBed } from "@angular/core/testing";
import { OrderStatus } from "./order-status";

describe("OrderStatus", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [OrderStatus] });
    expect(TestBed.createComponent(OrderStatus).componentInstance).toBeTruthy();
  });
});
