import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MultiAxisChart } from "./multi-axis-chart";

describe("MultiAxisChart", () => {
  let component: MultiAxisChart;
  let fixture: ComponentFixture<MultiAxisChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(MultiAxisChart, {
      set: { template: "<div>Mock MultiAxisChart</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [MultiAxisChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiAxisChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have null data by default", () => {
    expect(component.dataSignal()).toBeNull();
  });

  it("should build a dual-axis ECharts option", () => {
    const testData = {
      labels: ["A", "B"],
      datasets: [
        { label: "Ingresos", data: [10, 20] },
        { label: "Cantidad", data: [1, 2], yAxisID: "y1" },
      ],
    };
    fixture.componentRef.setInput("data", testData);
    fixture.detectChanges();
    const option = component.option() as any;
    expect(option.yAxis.length).toBe(2);
    expect(option.series.length).toBe(2);
    expect(option.series[1].yAxisIndex).toBe(1);
  });

  it("should use provided options over defaults", () => {
    const testOptions = { series: [{ type: "custom" }] };
    fixture.componentRef.setInput("options", testOptions);
    fixture.detectChanges();
    expect(component.option()).toEqual(testOptions);
  });
});
