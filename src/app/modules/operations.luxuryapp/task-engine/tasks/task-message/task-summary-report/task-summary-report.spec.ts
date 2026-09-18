import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { HtmlPrintService } from "@core/services/html-print.service";
import { vi } from "vitest";
import { TaskSummaryReport } from "./task-summary-report";

const OPEN_ITEMS = [
  {
    id: "1",
    status: "NotStarted",
    title: "Pendiente A",
    description: "desc A",
    scheduledAt: "25-sep-26",
    createdAtFilter: "2026-09-10T12:00:00",
    lastFollowUp: null,
    lastFollowUpDate: null,
  },
  {
    id: "2",
    status: "InProgress",
    title: "En proceso B",
    description: "desc B",
    scheduledAt: "20-sep-26",
    createdAtFilter: "2026-09-12T12:00:00",
    lastFollowUp: "avance",
    lastFollowUpDate: "15-sep-26",
  },
];

const COMPLETED_ITEMS = [
  {
    id: "3",
    status: "Completed",
    title: "Concluida C",
    description: "desc C",
    scheduledAt: "01-sep-26",
    createdAtFilter: "2026-09-05T12:00:00",
    lastFollowUp: null,
    lastFollowUpDate: null,
  },
];

describe("TaskSummaryReport", () => {
  let component: TaskSummaryReport;
  let fixture: ComponentFixture<TaskSummaryReport>;
  let mockApiS: any;
  let mockToastS: any;

  const setup = () => {
    mockApiS = {
      onGetList: vi.fn().mockImplementation((url: string) =>
        Promise.resolve({
          nameGroup: "Grupo",
          assignee: null,
          totalRecords: url.includes("Completed") ? 1 : 2,
          items: url.includes("Completed") ? COMPLETED_ITEMS : OPEN_ITEMS,
        }),
      ),
    };
    mockToastS = { showSuccess: vi.fn(), showError: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskSummaryReport, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskSummaryReport],
      providers: [
        { provide: ApiResponseService, useValue: mockApiS },
        { provide: CustomToastService, useValue: mockToastS },
        {
          provide: HtmlPrintService,
          useValue: {
            esc: (value: unknown) => String(value ?? ""),
            getLogoDataUrl: vi.fn().mockResolvedValue(null),
            getStandardCss: () => "",
            buildStandardHeader: () => "",
            buildStandardFooter: () => "",
            printHtml: vi.fn(),
          },
        },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { ticketGroupId: "g1", groupName: "Grupo" } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskSummaryReport);
    component = fixture.componentInstance;
  };

  it("should group items into pending, in progress and completed", async () => {
    setup();
    await component.ngOnInit();

    const groups = component.groups();
    expect(groups.map((g) => g.key)).toEqual([
      "pending",
      "inProgress",
      "completed",
    ]);
    expect(component.total()).toBe(3);
  });

  it("should not show an execution date for completed tasks", async () => {
    setup();
    await component.ngOnInit();

    const completed = component.groups().find((g) => g.key === "completed");
    expect(completed?.rows[0].executionDate).toBe("—");
  });

  it("should filter by created date range", async () => {
    setup();
    await component.ngOnInit();

    component.fromControl.setValue(new Date(2026, 8, 11));
    component.toControl.setValue(new Date(2026, 8, 13));

    expect(component.total()).toBe(1);
    expect(component.groups()[0].rows[0].title).toBe("En proceso B");
  });

  it("should build the pdf header line with range and total", async () => {
    setup();
    await component.ngOnInit();

    expect(component.buildMetaLine()).toContain("3 tarea(s)");

    component.fromControl.setValue(new Date(2026, 8, 11));

    expect(component.buildMetaLine()).toContain("Del 11/9/2026 al hoy");
  });
});
