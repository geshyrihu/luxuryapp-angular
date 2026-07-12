import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { vi } from "vitest";
import { EITaskMessageDTOStatus } from "../../task-message-status.enum";
import { TaskMessageOperationReport } from "./task-operation-report";

describe("TaskMessageOperationReport", () => {
  let component: TaskMessageOperationReport;
  let fixture: ComponentFixture<TaskMessageOperationReport>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomToastS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;
  let mockTaskGroupService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomToastS = {};
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
      sizeFull: "100%",
    };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };
    mockTaskGroupService = {
      taskGroupMessageStatus: 2,
      setStatus: vi.fn(),
    };
    mockActivatedRoute = { snapshot: { params: { ticketGroupId: "group-1" } } };
    mockRouter = { navigate: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskMessageOperationReport, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskMessageOperationReport],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomToastService, useValue: mockCustomToastS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskMessageOperationReport);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default values", () => {
    expect(component.status).toBe(EITaskMessageDTOStatus.Cerrado);
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.ticketGroupId).toBe("group-1");
  });

  it("onLoadData should call api and set data", async () => {
    const mockData = [{ id: "1", isRelevant: true }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].isRelevantControl).toBeDefined();
  });

  it("onPreviewClicked should navigate to preview", () => {
    component.onPreviewClicked();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/tickets/weekly-report-preview",
    ]);
  });

  it("onChangeStatus should update status and load data", () => {
    component.onChangeStatus(1);
    expect(component.status).toBe(1);
  });
});
