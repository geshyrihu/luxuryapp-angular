import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { vi } from "vitest";
import { ReporteTickets } from "./reporte-tickets";

describe("ReporteTickets", () => {
  let component: ReporteTickets;
  let fixture: ComponentFixture<ReporteTickets>;
  let mockApiResponseS: any;
  let mockDateS: any;
  let mockPeriodMonthS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockDateS = {
      getDateFormat: vi.fn(() => "2025-01-01"),
    };
    mockPeriodMonthS = {
      getPeriodoInicio: new Date(2025, 0, 1),
      getPeriodoFin: new Date(2025, 0, 31),
      setPeriodo: vi.fn(),
    };
    mockCustomerIdS = { customerId: signal("cust-123") };
    mockTableScrollHeightS = { scrollHeight: "500px" };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ReporteTickets, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ReporteTickets],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DateService, useValue: mockDateS },
        { provide: PeriodMonthService, useValue: mockPeriodMonthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ReporteTickets);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it("onLoadData should fetch tickets data", async () => {
    const mockData = [{ solicitudes: 10, atendidas: 7, pendientes: 3 }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "ResumenGeneral/ReporteResumenTicket/cust-123/2025-01-01/2025-01-01",
    );
    expect(component.dataSignal()).toEqual(mockData);
  });

  it("onFiltrarPeriodo should set periodo and reload", () => {
    component.onFiltrarPeriodo("2025-02");
    expect(mockPeriodMonthS.setPeriodo).toHaveBeenCalledWith("2025-02");
  });

  it("onSumaTotales should sum values correctly", () => {
    const data = [
      { solicitudes: 10, atendidas: 7, pendientes: 3 },
      { solicitudes: 5, atendidas: 3, pendientes: 2 },
    ];

    const result = component.onSumaTotales(data);

    expect(result.solicitudes).toBe(15);
    expect(result.atendidas).toBe(10);
    expect(result.pendientes).toBe(5);
  });

  it("onSumaTotales should handle empty data", () => {
    const result = component.onSumaTotales([]);
    expect(result.solicitudes).toBe(0);
    expect(result.atendidas).toBe(0);
    expect(result.pendientes).toBe(0);
  });

  it("onSumaTotales should handle null data", () => {
    const result = component.onSumaTotales(null);
    expect(result.solicitudes).toBe(0);
    expect(result.atendidas).toBe(0);
    expect(result.pendientes).toBe(0);
  });
});
