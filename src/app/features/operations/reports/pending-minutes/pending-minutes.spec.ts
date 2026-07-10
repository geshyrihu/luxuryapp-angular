import { vi } from "vitest";

import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PendingMinutes } from "./pending-minutes";

describe("PendingMinutes", () => {
  let component: PendingMinutes;
  let fixture: ComponentFixture<PendingMinutes>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = { onGetList: vi.fn().mockResolvedValue(null) };
    mockCustomerIdS = { customerId: signal("cust-123") };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };

    TestBed.overrideComponent(PendingMinutes, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PendingMinutes],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PendingMinutes);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.loading()).toBe(true);
    expect(component.reportData()).toBeNull();
  });

  it("should call onLoadData when customerId is set via effect", () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "Reports/PendingMinutes/cust-123",
    );
  });

  it("onLoadData should set reportData with API response", async () => {
    const fakeResponse = {
      pendings: [{ id: 1, title: "Minuta pendiente" }],
      customer: { id: "cust-123" },
      administrador: [{ name: "Admin" }],
    };
    mockApiResponseS.onGetList.mockResolvedValue(fakeResponse);
    await component.onLoadData("cust-123");
    expect(component.reportData()).toEqual(fakeResponse);
  });

  it("onLoadData should reset reportData to null before loading", async () => {
    component.reportData.set({
      pendings: [],
      customer: {},
      administrador: [],
    } as any);
    mockApiResponseS.onGetList.mockResolvedValue(null);
    await component.onLoadData("cust-123");
    expect(component.reportData()).toBeNull();
  });

  it("onLoadData should handle API error gracefully", async () => {
    mockApiResponseS.onGetList.mockRejectedValue(new Error("API Error"));
    await component.onLoadData("cust-123");
    expect(component.reportData()).toBeNull();
  });
});
