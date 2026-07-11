import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PrintService } from "src/app/core/services/print.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { vi } from "vitest";
import { MyAssignedTasksList } from "./my-assigned-tasks-list";

describe("MyAssignedTasksList", () => {
  let component: MyAssignedTasksList;
  let fixture: ComponentFixture<MyAssignedTasksList>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;
  let mockPrintS: any;
  let mockTaskGroupService: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };
    mockPrintS = { printElement: vi.fn() };
    mockTaskGroupService = {
      taskGroupMessageStatus: "NotStarted",
      setStatus: vi.fn(),
      year: 2024,
      numeroSemana: 42,
    };
    mockActivatedRoute = { snapshot: { params: {} } };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(MyAssignedTasksList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MyAssignedTasksList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: PrintService, useValue: mockPrintS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MyAssignedTasksList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.status).toBe("NotStarted");
  });

  it("statusLabel should return correct labels", () => {
    expect(component.statusLabel("NotStarted")).toBe("No iniciado");
    expect(component.statusLabel("InProgress")).toBe("En proceso");
    expect(component.statusLabel("Reopened")).toBe("Reabierto");
    expect(component.statusLabel("Unknown")).toBe("Unknown");
  });

  it("onLoadData should call api and set data", async () => {
    const mockData = [{ id: "1", description: "Task 1" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData("NotStarted");
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockData);
    expect(component.status).toBe("NotStarted");
  });

  it("getTruncatedDescription should truncate long descriptions", () => {
    const long = "a".repeat(200);
    expect(component.getTruncatedDescription(long).length).toBe(103);
    const short = "short";
    expect(component.getTruncatedDescription(short)).toBe("short");
  });

  it("printReport should call printService", () => {
    component.printReport();
    expect(mockPrintS.printElement).toHaveBeenCalled();
  });
});
