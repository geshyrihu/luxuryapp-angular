import { TestBed } from "@angular/core/testing";
import { Gauge } from "./gauge";

describe("Gauge", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [Gauge] });
    expect(TestBed.createComponent(Gauge).componentInstance).toBeTruthy();
  });
});
