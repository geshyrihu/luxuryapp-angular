import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AdvancedPieChart } from "./advanced-pie-chart";

describe("AdvancedPieChart", () => {
  let component: AdvancedPieChart;
  let fixture: ComponentFixture<AdvancedPieChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(AdvancedPieChart, {
      set: { template: "<div>Mock AdvancedPieChart</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [AdvancedPieChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedPieChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have empty data by default", () => {
    expect(component.dataGrafico()).toEqual([]);
  });

  it("should have default color scheme with 3 colors", () => {
    expect(component.colorScheme().domain?.length).toBe(3);
  });

  it("should build an ECharts pie option from ngx-charts data", () => {
    const testData = [
      { name: "A", value: 10 },
      { name: "B", value: 20 },
    ];
    fixture.componentRef.setInput("dataGrafico", testData);
    fixture.detectChanges();
    const option = component.option() as any;
    expect(option.series[0].type).toBe("pie");
    expect(option.series[0].data.length).toBe(2);
  });
});
