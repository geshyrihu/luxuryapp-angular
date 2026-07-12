import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { of } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { vi } from "vitest";
import { TaskForm } from "./task-form";

describe("TaskForm", () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomToastS: any;
  let mockCustomerIdS: any;
  let mockDateS: any;
  let mockDialogHandlerS: any;
  let mockEnumSelectS: any;
  let mockConfig: any;
  let mockRef: any;
  let mockTaskGroupService: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetItem: vi
        .fn()
        .mockResolvedValue({ title: "Test", description: "Desc" }),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomToastS = { showError: vi.fn() };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDateS = { getDateFormat: vi.fn().mockReturnValue("2024-01-15") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockEnumSelectS = {
      priorityLevel: vi.fn().mockReturnValue(of([{ value: 1, label: "Alta" }])),
    };
    mockConfig = { data: { id: "", ticketGroupId: "g1" } };
    mockRef = { close: vi.fn() };
    mockTaskGroupService = { taskGroupMessageStatus: "NotStarted" };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomToastService, useValue: mockCustomToastS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DateService, useValue: mockDateS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_priority()).toEqual([]);
    expect(component.cb_ticket_group()).toEqual([]);
    expect(component.isLegalWorkGroup()).toBe(false);
  });

  it("should have form with expected controls", () => {
    expect(component.form.get("id")).not.toBeNull();
    expect(component.form.contains("title")).toBe(true);
    expect(component.form.contains("description")).toBe(true);
    expect(component.form.contains("priority")).toBe(true);
    expect(component.form.contains("ticketGroupId")).toBe(true);
  });

  it("ngOnInit should load select items", async () => {
    await component.ngOnInit();
    expect(mockEnumSelectS.priorityLevel).toHaveBeenCalled();
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it("onTicketGroupChange should load users and legal matters", () => {
    component.onTicketGroupChange("g1");
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it("onAssigneeChange should patch form with assignee details", () => {
    component.cb_application_user.set([{ value: "u1", label: "User 1" }]);
    component.onAssigneeChange("u1");
    expect(component.form.value.assigneeId).toBe("u1");
    expect(component.form.value.assignee).toBe("User 1");
  });

  it("onSubmit should call api and close ref on success", async () => {
    component.form.patchValue({
      title: "Test",
      description: "Desc",
      priority: 1,
      ticketGroupId: "g1",
    });
    component.onSubmit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onPost).toHaveBeenCalled();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });
});
