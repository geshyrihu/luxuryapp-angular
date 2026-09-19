import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RadarChart } from "./radar-chart";

describe("RadarChart", () => {
  let component: RadarChart;
  let fixture: ComponentFixture<RadarChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(RadarChart, {
      set: { template: "<div>Mock RadarChart</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [RadarChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RadarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have empty labels by default", () => {
    expect(component.chartData().labels).toEqual([]);
  });

  it("should build Chart.js radar data", () => {
    const testData = {
      labels: ["Speed", "Strength"],
      datasets: [{ data: [80, 90], label: "Player 1" }],
    };
    fixture.componentRef.setInput("chartData", testData);
    fixture.detectChanges();
    const data = component.renderData() as any;
    expect(data.labels.length).toBe(2);
    expect(data.datasets[0].data).toEqual([80, 90]);
  });

  it("should return undefined for getBase64Image when chart is not initialized", () => {
    expect(component.getBase64Image()).toBeUndefined();
  });

  it("should not throw on reinit when chart is not initialized", () => {
    expect(() => component.reinit()).not.toThrow();
  });
});
