import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CustomBarChart } from "./custom-bar-chart";

describe("CustomBarChart", () => {
  let component: CustomBarChart;
  let fixture: ComponentFixture<CustomBarChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(CustomBarChart, {
      set: { template: "<div>Mock CustomBarChart</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [CustomBarChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomBarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have null data by default", () => {
    expect(component.dataSignal()).toBeNull();
  });

  it("should default to line type", () => {
    expect(component.chartType()).toBe("line");
  });

  it("should build a cartesian ECharts option from Chart.js data", () => {
    const testData = {
      labels: ["A", "B"],
      datasets: [{ label: "Test", data: [1, 2], borderColor: "var(--ds-text-primary)" }],
    };
    fixture.componentRef.setInput("data", testData);
    fixture.detectChanges();
    const option = component.option() as any;
    expect(option.xAxis.data).toEqual(["A", "B"]);
    expect(option.series[0].type).toBe("line");
    expect(option.series[0].data).toEqual([1, 2]);
  });

  it("should use provided options over defaults", () => {
    const testOptions = { series: [{ type: "custom" }] };
    fixture.componentRef.setInput("options", testOptions);
    fixture.detectChanges();
    expect(component.option()).toEqual(testOptions);
  });
});
