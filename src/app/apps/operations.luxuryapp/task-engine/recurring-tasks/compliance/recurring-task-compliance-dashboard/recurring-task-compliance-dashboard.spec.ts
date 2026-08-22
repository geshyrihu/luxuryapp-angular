import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ComplianceDashboardDTO } from "src/app/core/interfaces/recurring-tasks/recurring-task-compliance.interface";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RecurringTaskComplianceDashboard } from "./recurring-task-compliance-dashboard";

describe("RecurringTaskComplianceDashboard", () => {
  const apiResponseS = {
    onGetList: vi.fn(),
  };

  beforeEach(() => {
    apiResponseS.onGetList.mockReset();
    apiResponseS.onGetList.mockResolvedValue({
      groups: [],
      totalGroupsWithoutTemplates: 0,
    } satisfies ComplianceDashboardDTO);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RecurringTaskComplianceDashboard],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: () => "customer-1" },
        },
        {
          provide: TableScrollHeightService,
          useValue: { scrollHeight: "400px" },
        },
      ],
    }).overrideComponent(RecurringTaskComplianceDashboard, {
      set: { template: "" },
    });
  });

  it("loads dashboard by selected customer", async () => {
    apiResponseS.onGetList.mockResolvedValueOnce({
      totalGroupsWithoutTemplates: 1,
      groups: [
        {
          workGroupId: "group-1",
          workGroupName: "Operaciones",
          categoryName: "Operaciones",
          hasActiveTemplates: false,
          onTimeCount: 2,
          overdueCount: 1,
          breachedCount: 1,
          carriedOverCount: 1,
          criticalClosedTotal: 2,
          criticalClosedWithAttachmentCount: 1,
        },
      ],
    } satisfies ComplianceDashboardDTO);

    const fixture = TestBed.createComponent(RecurringTaskComplianceDashboard);
    const component = fixture.componentInstance;

    await component.onLoadData();

    expect(apiResponseS.onGetList).toHaveBeenCalledWith(
      Endpoints.RecurringTaskCompliance.dashboard("customer-1"),
    );
    expect(component.groups()).toHaveLength(1);
    expect(component.totalGroupsWithoutTemplates()).toBe(1);
  });

  it("shows N/A when there are no critical closed tasks to evaluate", () => {
    const fixture = TestBed.createComponent(RecurringTaskComplianceDashboard);
    const component = fixture.componentInstance;

    expect(
      component.criticalAttachmentPercentage({
        workGroupId: "group-1",
        workGroupName: "Operaciones",
        categoryName: "Operaciones",
        hasActiveTemplates: true,
        onTimeCount: 0,
        overdueCount: 0,
        breachedCount: 0,
        carriedOverCount: 0,
        criticalClosedTotal: 0,
        criticalClosedWithAttachmentCount: 0,
      }),
    ).toBe("N/A");
  });

  it("calculates critical attachment percentage from raw counts", () => {
    const fixture = TestBed.createComponent(RecurringTaskComplianceDashboard);
    const component = fixture.componentInstance;

    expect(
      component.criticalAttachmentPercentage({
        workGroupId: "group-1",
        workGroupName: "Operaciones",
        categoryName: "Operaciones",
        hasActiveTemplates: true,
        onTimeCount: 0,
        overdueCount: 0,
        breachedCount: 0,
        carriedOverCount: 0,
        criticalClosedTotal: 3,
        criticalClosedWithAttachmentCount: 2,
      }),
    ).toBe("67%");
  });

  it("does not call the API when there is no customer in context", async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RecurringTaskComplianceDashboard],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseS },
        {
          provide: CustomerIdService,
          useValue: { customerId: () => null },
        },
        {
          provide: TableScrollHeightService,
          useValue: { scrollHeight: "400px" },
        },
      ],
    }).overrideComponent(RecurringTaskComplianceDashboard, {
      set: { template: "" },
    });

    const fixture = TestBed.createComponent(RecurringTaskComplianceDashboard);
    const component = fixture.componentInstance;

    await component.onLoadData();

    expect(apiResponseS.onGetList).not.toHaveBeenCalled();
    expect(component.groups()).toEqual([]);
    expect(component.totalGroupsWithoutTemplates()).toBe(0);
  });
});
