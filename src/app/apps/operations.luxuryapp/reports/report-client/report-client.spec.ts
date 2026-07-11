import { vi } from "vitest";

import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ReportClient } from "./report-client";

describe("ReportClient", () => {
  let component: ReportClient;
  let fixture: ComponentFixture<ReportClient>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue({ data: [] }) };
    mockCustomerIdS = { customerId: signal("cust-123") };
    mockActivatedRoute = {
      snapshot: {
        params: {
          customer: "cust-456",
          inicio: "2026-01-01",
          final: "2026-01-31",
        },
      },
    };

    TestBed.overrideComponent(ReportClient, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ReportClient],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ReportClient);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default property values", () => {
    expect(component.data).toEqual([]);
    expect(component.customer).toBe("");
    expect(component.inicio).toBe("");
    expect(component.final).toBe("");
    expect(component.rutaFinal).toBe("");
  });

  it("should read params from ActivatedRoute and call API on init", () => {
    fixture.detectChanges();
    expect(component.customer).toBe("cust-456");
    expect(component.inicio).toBe("2026-01-01");
    expect(component.final).toBe("2026-01-31");
    expect(component.rutaFinal).toBe(
      "tasks/GetReportClient/cust-456/2026-01-01/2026-01-31",
    );
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      component.rutaFinal,
    );
  });

  it("should set data from API response", async () => {
    const fakeData = { data: [{ id: 1, description: "Report item" }] };
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.data).toEqual(fakeData);
  });
});
