import { TestBed } from "@angular/core/testing";
import { Gauge } from "../../primitives/gauge/gauge";

describe("Gauge", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [Gauge] });
    expect(TestBed.createComponent(Gauge).componentInstance).toBeTruthy();
  });
});
