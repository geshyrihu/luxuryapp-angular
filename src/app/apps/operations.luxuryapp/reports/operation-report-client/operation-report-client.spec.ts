import { vi } from "vitest";

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { OperationReportClient } from "./operation-report-client";

describe("OperationReportClient", () => {
  let component: OperationReportClient;
  let fixture: ComponentFixture<OperationReportClient>;
  let mockApiResponseS: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue({ tasks: [] }) };
    mockActivatedRoute = {
      snapshot: {
        params: {
          customer: "cust-456",
          inicio: "2026-01-01",
          final: "2026-01-31",
        },
      },
    };

    TestBed.overrideComponent(OperationReportClient, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [OperationReportClient],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(OperationReportClient);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.data()).toBeNull();
    expect(component.customer).toBe("");
    expect(component.inicio).toBe("");
    expect(component.final).toBe("");
  });

  it("should read params from ActivatedRoute and call onLoadData on init", () => {
    fixture.detectChanges();
    expect(component.customer).toBe("cust-456");
    expect(component.inicio).toBe("2026-01-01");
    expect(component.final).toBe("2026-01-31");
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "task-report/GetReportClient/cust-456/2026-01-01/2026-01-31",
    );
  });

  it("onLoadData should set data signal from API response", async () => {
    const fakeData = { tasks: [{ id: 1, description: "Task 1" }] };
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.data()).toEqual(fakeData);
  });
});
