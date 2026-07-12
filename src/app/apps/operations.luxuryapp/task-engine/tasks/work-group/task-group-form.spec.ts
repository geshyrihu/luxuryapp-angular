import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { of } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { vi } from "vitest";
import { TaskGroupForm } from "./task-group-form";

describe("TaskGroupForm", () => {
  let component: TaskGroupForm;
  let fixture: ComponentFixture<TaskGroupForm>;
  let mockApiS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockEnumS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiS = {
      onGetItem: vi.fn().mockResolvedValue({ nameGroup: "Test Group" }),
      onGetSelectItem: vi
        .fn()
        .mockResolvedValue([{ value: "c1", label: "Category 1" }]),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockEnumS = {
      visibilityLevel: vi
        .fn()
        .mockReturnValue(of([{ value: 1, label: "Public" }])),
    };
    mockConfig = { data: { id: "" } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskGroupForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskGroupForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: EnumSelectService, useValue: mockEnumS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskGroupForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.id()).toBe("");
    expect(component.submitting()).toBe(false);
    expect(component.cb_TaskGroupCategory()).toEqual([]);
  });

  it("should have form with expected controls", () => {
    expect(component.form.get("id")).not.toBeNull();
    expect(component.form.contains("customerId")).toBe(true);
    expect(component.form.contains("visibility")).toBe(true);
    expect(component.form.contains("TaskGroupCategoryId")).toBe(true);
  });

  it("onLoadTaskGroupCategory should call api and set signal", async () => {
    const categories = [{ value: "c1", label: "Category 1" }];
    mockApiS.onGetSelectItem.mockResolvedValue(categories);

    component.onLoadTaskGroupCategory();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.cb_TaskGroupCategory()).toEqual(categories);
  });

  it("onLoadData should call api and patch form", async () => {
    const result = { nameGroup: "Group X" };
    mockApiS.onGetItem.mockResolvedValue(result);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiS.onGetItem).toHaveBeenCalled();
  });
});
