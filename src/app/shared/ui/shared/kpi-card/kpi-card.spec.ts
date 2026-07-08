import { TestBed } from "@angular/core/testing";
import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [KpiCard] });
    expect(TestBed.createComponent(KpiCard).componentInstance).toBeTruthy();
  });
});
