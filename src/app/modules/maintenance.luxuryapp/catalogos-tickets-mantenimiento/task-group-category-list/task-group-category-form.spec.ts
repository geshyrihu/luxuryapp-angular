import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { vi } from "vitest";
import { TaskGroupCategoryForm } from "./task-group-category-form";

describe("TaskGroupCategoryForm", () => {
  let component: TaskGroupCategoryForm;
  let fixture: ComponentFixture<TaskGroupCategoryForm>;
  let mockApiResponseS: any;
  let mockEnumService: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue({ name: "Category" }),
    };
    mockEnumService = {
      departament: vi
        .fn()
        .mockReturnValue({
          subscribe: vi.fn((cb: any) => cb([{ value: 1, label: "Dept 1" }])),
        }),
    };
    mockConfig = { data: { id: "" } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskGroupCategoryForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskGroupCategoryForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EnumSelectService, useValue: mockEnumService },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskGroupCategoryForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_departament()).toEqual([]);
    expect(component.id).toBe("");
  });

  it("should have form with expected controls", () => {
    expect(component.form.get("id")).not.toBeNull();
    expect(component.form.contains("name")).toBe(true);
    expect(component.form.contains("description")).toBe(true);
    expect(component.form.contains("departament")).toBe(true);
    expect(component.form.contains("emoji")).toBe(true);
    expect(component.form.contains("color")).toBe(true);
  });

  it("ngOnInit should subscribe to enum and set id", () => {
    component.ngOnInit();
    expect(mockEnumService.departament).toHaveBeenCalled();
    expect(component.id).toBe("");
  });

  it("onLoadData should call api and patch form", async () => {
    component.id = "cat-1";
    const result = { name: "Test Category" };
    mockApiResponseS.onGetItem.mockResolvedValue(result);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.form.value.name).toBe("Test Category");
  });
});
