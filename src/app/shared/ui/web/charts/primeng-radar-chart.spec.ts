import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PrimengRadarChart } from "./primeng-radar-chart";

describe("PrimengRadarChart", () => {
  let component: PrimengRadarChart;
  let fixture: ComponentFixture<PrimengRadarChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(PrimengRadarChart, {
      set: { template: "<div>Mock RadarChart</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [PrimengRadarChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengRadarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have empty labels by default", () => {
    expect(component.chartData().labels).toEqual([]);
  });

  it("should build a radar ECharts option", () => {
    const testData = {
      labels: ["Speed", "Strength"],
      datasets: [{ data: [80, 90], label: "Player 1" }],
    };
    fixture.componentRef.setInput("chartData", testData);
    fixture.detectChanges();
    const option = component.option() as any;
    expect(option.radar.indicator.length).toBe(2);
    expect(option.series[0].type).toBe("radar");
    expect(option.series[0].data[0].value).toEqual([80, 90]);
  });

  it("should return undefined for getBase64Image when chart is not initialized", () => {
    expect(component.getBase64Image()).toBeUndefined();
  });

  it("should not throw on reinit when chart is not initialized", () => {
    expect(() => component.reinit()).not.toThrow();
  });
});
