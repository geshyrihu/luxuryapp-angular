import { vi } from "vitest";

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ReportService } from "src/app/core/services/report.service";
import { ReporteTicketPendientesProveedor } from "./reporte-ticket-pendientes-proveedor";

describe("ReporteTicketPendientesProveedor", () => {
  let component: ReporteTicketPendientesProveedor;
  let fixture: ComponentFixture<ReporteTicketPendientesProveedor>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockReportService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue([]) };
    mockAuthS = {};
    mockReportService = {};
    mockRouter = {};
    mockActivatedRoute = {
      snapshot: {
        params: { customerId: "cust-123", departamentId: "dept-456" },
      },
    };

    TestBed.overrideComponent(ReporteTicketPendientesProveedor, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ReporteTicketPendientesProveedor],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: ReportService, useValue: mockReportService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ReporteTicketPendientesProveedor);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.loading()).toBe(true);
    expect(component.data).toEqual([]);
    expect(component.tablePrimeNgRows).toBe(30);
    expect(component.rowsPerPageOptions).toEqual([30, 50, 75, 100, 150, 200]);
    expect(component.globalFilterFields).toEqual([]);
    expect(component.customerId).toBeUndefined();
    expect(component.departamentId).toBeUndefined();
  });

  it("should read params from ActivatedRoute and call onLoadData on init", () => {
    fixture.detectChanges();
    expect(component.customerId).toBe("cust-123");
    expect(component.departamentId).toBe("dept-456");
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "ticket/getreportpendingprovider/cust-123/dept-456",
    );
  });

  it("onLoadData should set data and globalFilterFields from API response", async () => {
    const fakeData = [{ id: 1, ticket: "TKT-001", proveedor: "Proveedor A" }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.data).toEqual(fakeData);
    expect(component.globalFilterFields).toEqual(["id", "ticket", "proveedor"]);
  });
});
