import { HttpClient } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { vi } from "vitest";
import { TaskPendingBoard } from "./task-pending-board";

describe("TaskPendingBoard", () => {
  let component: TaskPendingBoard;
  let fixture: ComponentFixture<TaskPendingBoard>;
  let mockApiS: any;
  let mockHtmlPrintS: any;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockHttp: any;

  beforeEach(() => {
    mockApiS = {
      onGetList: vi
        .fn()
        .mockResolvedValue({
          nameGroup: "Test Group",
          totalRecords: 0,
          items: [],
        }),
    };
    mockHtmlPrintS = {
      esc: vi.fn().mockImplementation((s: string) => s),
      getLogoDataUrl: vi.fn().mockResolvedValue("data:image/png;base64,"),
      getStandardCss: vi.fn().mockReturnValue(""),
      buildStandardHeader: vi.fn().mockReturnValue(""),
      buildStandardFooter: vi.fn().mockReturnValue(""),
      printHtml: vi.fn(),
    };
    mockActivatedRoute = { snapshot: { params: { ticketGroupId: "group-1" } } };
    mockRouter = { navigate: vi.fn() };
    mockHttp = { get: vi.fn().mockReturnValue(of({})) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskPendingBoard, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskPendingBoard],
      providers: [
        { provide: ApiResponseService, useValue: mockApiS },
        { provide: HtmlPrintService, useValue: mockHtmlPrintS },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: HttpClient, useValue: mockHttp },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskPendingBoard);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.ticketGroupId).toBe("group-1");
    expect(component.nameGroup()).toBe("");
    expect(component.loading()).toBe(true);
    expect(component.exportingPdf()).toBe(false);
  });

  it("ngOnInit should load data", async () => {
    await component.ngOnInit();
    expect(component.nameGroup()).toBe("Test Group");
    expect(component.loading()).toBe(false);
  });

  it("statusLabel should return correct labels", () => {
    expect(component.statusLabel("InProgress")).toBe("En Proceso");
    expect(component.statusLabel("NotStarted")).toBe("No Iniciado");
    expect(component.statusLabel("Reopened")).toBe("Reabierto");
    expect(component.statusLabel("Completed")).toBe("Terminado");
  });

  it("onBack should navigate back", () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/tickets/messages",
      "group-1",
    ]);
  });

  it("formatIndex should pad numbers", () => {
    expect(component.formatIndex(5)).toBe("05");
    expect(component.formatIndex(15)).toBe("15");
  });
});
