import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskGroupService } from "src/app/features/operations/task-engine/tasks/task.service";
import { vi } from "vitest";
import { TaskReportWorkPlan } from "./task-report-work-plan";

describe("TaskReportWorkPlan", () => {
  let component: TaskReportWorkPlan;
  let fixture: ComponentFixture<TaskReportWorkPlan>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;
  let mockTaskGroupService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };
    mockTaskGroupService = { taskGroupMessageStatus: 0 };
    mockRouter = { navigate: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskReportWorkPlan, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskReportWorkPlan],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskReportWorkPlan);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.status).toBe(0);
  });

  it("onLoadData should call api and set signals", async () => {
    const mockData = [
      { id: "1", assigneeId: "u1", assignee: "User 1" },
      { id: "2", assigneeId: "u2", assignee: "User 2" },
    ];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockData);
    expect(component.cb_assignee.length).toBe(3);
  });

  it("onPreviewClicked should navigate", () => {
    component.onPreviewClicked();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/tickets/work-plan-preview",
    ]);
  });
});
