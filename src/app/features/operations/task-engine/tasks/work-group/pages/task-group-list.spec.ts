import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskGroupService } from "src/app/features/operations/task-engine/tasks/task.service";
import { vi } from "vitest";
import { TaskGroupList } from "./task-group-list";

describe("TaskGroupList", () => {
  let component: TaskGroupList;
  let fixture: ComponentFixture<TaskGroupList>;
  let mockApiResponseS: any;
  let mockAspRoleS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;
  let mockTaskGroupService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onPatch: vi.fn().mockResolvedValue(true),
      onPost: vi.fn().mockResolvedValue(true),
      onDelete: vi.fn().mockResolvedValue(true),
    };
    mockAspRoleS = { roleSignal: vi.fn().mockReturnValue(signal(false)) };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };
    mockTaskGroupService = {
      taskGroupMessageStatus: 0,
      setStatus: vi.fn(),
    };
    mockRouter = { navigate: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskGroupList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskGroupList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskGroupList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.value()).toBe(true);
  });

  it("onLoadData should call api and set signals", async () => {
    const mockData = [{ id: "1", nameGroup: "Group A" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockData);
    expect(component.loading()).toBe(false);
  });

  it("onChange should toggle value and reload", () => {
    const spy = vi.spyOn(component, "onLoadData");
    component.onChange(false);
    expect(component.value()).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it("onDelete should remove item from signal", async () => {
    await new Promise((resolve) => setTimeout(resolve));
    component.dataSignal.set([{ id: "1" }, { id: "2" }]);
    mockApiResponseS.onDelete.mockResolvedValue(true);

    component.onDelete("1");
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].id).toBe("2");
  });

  it("onNavigateMessage should navigate and set status", () => {
    component.onNavigateMessage("group-1", 0 as any);
    expect(mockTaskGroupService.taskGroupMessageStatus).toBe(0);
    expect(mockTaskGroupService.setStatus).toHaveBeenCalledWith(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/tickets/messages/group-1",
    ]);
  });
});
