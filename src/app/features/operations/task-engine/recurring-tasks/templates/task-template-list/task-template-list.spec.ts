import { IonicMocks } from "src/app/core/testing/ionic-mocks";

vi.mock("@ionic/angular/standalone", () => ({ ...IonicMocks }));
vi.mock("@ionic/core", () => ({}));
vi.mock("@ionic/core/components", () => ({}));
vi.mock("ionicons/icons", () => ({ storefrontOutline: "storefront-outline" }));
vi.mock("ionicons", () => ({ addIcons: vi.fn() }));

import { signal } from "@angular/core";
import { vi } from "vitest";

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskTemplateList } from "./task-template-list";

describe("TaskTemplateList", () => {
  let component: TaskTemplateList;
  let fixture: ComponentFixture<TaskTemplateList>;
  let mockApiResponseS: any;
  let mockRouter: any;
  let mockDialogHandlerS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
    };
    mockRouter = {
      navigate: vi.fn(),
    };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "lg",
    };
    mockTableScrollHeightS = {
      scrollHeight: signal("600px"),
    };

    TestBed.overrideComponent(TaskTemplateList, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [TaskTemplateList],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: Router, useValue: mockRouter },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskTemplateList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.data()).toEqual([]);
    expect(component.loading()).toBe(true);
    expect(component.state()).toBe(true);
  });

  it("should load data on init", () => {
    const fakeData = [{ id: "t1", name: "Template 1" }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);

    component.ngOnInit();

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "recurring-tasks/templates/list/true",
    );
  });

  it("should set data on successful load", async () => {
    const fakeData = [{ id: "t1", name: "Template 1" }];
    mockApiResponseS.onGetList.mockResolvedValue(fakeData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.data()).toEqual(fakeData);
    expect(component.loading()).toBe(false);
  });

  it("should set empty array when API returns null", async () => {
    mockApiResponseS.onGetList.mockResolvedValue(null);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.data()).toEqual([]);
  });

  it("should set empty array when API throws error", async () => {
    mockApiResponseS.onGetList.mockRejectedValue(new Error("Network error"));

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.data()).toEqual([]);
    expect(component.loading()).toBe(false);
  });

  it("should navigate to items page", () => {
    component.onManageItems("tmpl-1");
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/recurring-tasks",
      "tmpl-1",
      "items",
    ]);
  });

  it("should delete and reload on success", async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);

    component.onDelete("tmpl-1");

    expect(mockApiResponseS.onDelete).toHaveBeenCalledWith(
      "recurring-tasks/templates/tmpl-1",
    );
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "recurring-tasks/templates/list/true",
    );
  });

  it("should not reload on delete when API returns false", async () => {
    mockApiResponseS.onDelete.mockResolvedValue(false);
    await new Promise((resolve) => setTimeout(resolve));
    mockApiResponseS.onGetList.mockClear();

    component.onDelete("tmpl-1");
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).not.toHaveBeenCalled();
  });

  it("should handle delete error gracefully", async () => {
    mockApiResponseS.onDelete.mockRejectedValue(new Error("Network error"));

    component.onDelete("tmpl-1");
    await new Promise((resolve) => setTimeout(resolve));
  });

  it("should change state and reload", () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);

    component.onChangeState(false);

    expect(component.state()).toBe(false);
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "recurring-tasks/templates/list/false",
    );
  });

  it("should open form dialog for new template", () => {
    component.showForm();

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { template: undefined },
      "Nueva Plantilla",
      "lg",
    );
  });

  it("should open form dialog for editing template", () => {
    const template = { id: "tmpl-1", name: "Test" };
    component.showForm(template as any);

    expect(mockDialogHandlerS.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { template },
      "Editar Plantilla",
      "lg",
    );
  });

  it("should reload on dialog close with result true", async () => {
    mockApiResponseS.onGetList.mockResolvedValue([]);

    component.showForm();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "recurring-tasks/templates/list/true",
    );
  });
});
