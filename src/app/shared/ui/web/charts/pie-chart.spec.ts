import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PieChart } from "./pie-chart";

describe("PieChart", () => {
  let component: PieChart;
  let fixture: ComponentFixture<PieChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(PieChart, {
      set: { template: "<div>Mock PieChart</div>", imports: [] },
    });

    await TestBed.configureTestingModule({
      imports: [PieChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default data", () => {
    expect(component.dataGrafico().length).toBe(2);
    expect(component.dataGrafico()[0].name).toBe("Germany");
  });

  it("should have default color scheme", () => {
    expect(component.colorScheme().domain?.length).toBe(2);
  });

  it("should build Chart.js pie data", () => {
    const data = component.chartData() as any;
    expect(data.datasets[0].data.length).toBe(2);
  });

  it("should accept custom data via input", () => {
    const customData = [{ name: "Test", value: 100 }];
    fixture.componentRef.setInput("dataGrafico", customData);
    fixture.detectChanges();
    expect(component.dataGrafico()).toEqual(customData);
    expect((component.chartData() as any).datasets[0].data.length).toBe(1);
  });
});
