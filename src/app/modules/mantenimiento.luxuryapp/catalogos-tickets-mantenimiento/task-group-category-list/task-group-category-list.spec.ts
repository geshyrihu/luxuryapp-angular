import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { vi } from "vitest";
import { TaskGroupCategoryList } from "./task-group-category-list";

describe("TaskGroupCategoryList", () => {
  let component: TaskGroupCategoryList;
  let fixture: ComponentFixture<TaskGroupCategoryList>;
  let mockApiResponseS: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
    };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskGroupCategoryList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskGroupCategoryList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskGroupCategoryList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it("onLoadData should call api and set signals", async () => {
    const mockData = [{ id: "1", name: "Category A" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal()).toEqual(mockData);
    expect(component.loading()).toBe(false);
  });

  it("onDelete should remove item from signal", async () => {
    await new Promise((resolve) => setTimeout(resolve));
    component.dataSignal.set([{ id: "1" }, { id: "2" }]);

    component.onDelete("1");
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.dataSignal().length).toBe(1);
    expect(component.dataSignal()[0].id).toBe("2");
  });

  it("onModalForm should open dialog and reload on success", async () => {
    component.onModalForm({ id: "1", title: "Edit Category" });
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });
});
