import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { OrgChartBase } from "./org-chart.base";

@Component({ selector: "test-org-chart", standalone: true, template: "" })
class Host extends OrgChartBase {}

describe("OrgChartBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
