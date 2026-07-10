import { BreakpointObserver } from "@angular/cdk/layout";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { vi } from "vitest";
import { TaskGroupService } from "../../task.service";
import { TaskStatus } from "./task-status";

describe("TaskStatus", () => {
  let component: TaskStatus;
  let fixture: ComponentFixture<TaskStatus>;
  let mockTaskGroupService: any;
  let mockApiResponseS: any;
  let mockEnumSelectS: any;
  let mockBreakpointObserver: any;

  beforeEach(() => {
    mockTaskGroupService = {
      taskGroupMessageStatus: "NotStarted",
      setStatus: vi.fn(),
    };
    mockApiResponseS = {};
    mockEnumSelectS = {};
    mockBreakpointObserver = {
      observe: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskStatus, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskStatus],
      providers: [
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskStatus);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default status", () => {
    expect(component.status).toBe("NotStarted");
  });

  it("ngOnInit should fill cb_status", () => {
    component.ngOnInit();
    expect(component.cb_status.length).toBe(4);
    expect(component.cb_status[0].value).toBe("NotStarted");
  });

  it("onStatusChange should call service and emit", () => {
    const spy = vi.spyOn(component.statusChange, "emit");
    component.onStatusChange("InProgress");
    expect(mockTaskGroupService.setStatus).toHaveBeenCalledWith("InProgress");
    expect(component.status).toBe("InProgress");
    expect(spy).toHaveBeenCalledWith("InProgress");
  });

  it("getIconForStatus should return correct icons", () => {
    expect(component.getIconForStatus("NotStarted")).toBe("mdi:folder-open");
    expect(component.getIconForStatus("InProgress")).toBe("mdi:sync");
    expect(component.getIconForStatus("Completed")).toBe("mdi:check-circle");
    expect(component.getIconForStatus("Reopened")).toBe("mdi:refresh");
    expect(component.getIconForStatus("Unknown")).toBe("mdi:circle");
  });

  it("getSeverityForStatus should return correct severities", () => {
    expect(component.getSeverityForStatus("NotStarted")).toBe("danger");
    expect(component.getSeverityForStatus("InProgress")).toBe("warn");
    expect(component.getSeverityForStatus("Completed")).toBe("success");
    expect(component.getSeverityForStatus("Reopened")).toBe("info");
    expect(component.getSeverityForStatus("Unknown")).toBe("info");
  });
});
