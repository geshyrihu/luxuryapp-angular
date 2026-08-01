import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateRangeStorageService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/services/date-range-storage.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { vi } from "vitest";
import { TaskWeeklyReportPreview } from "./task-weekly-report-preview";

describe("TaskWeeklyReportPreview", () => {
  let component: TaskWeeklyReportPreview;
  let fixture: ComponentFixture<TaskWeeklyReportPreview>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockDateRangeStorageS: any;
  let mockTaskGroupService: any;
  let mockHtmlPrintS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      getBlobFileFromFullUrl: vi.fn().mockResolvedValue(null),
    };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDateRangeStorageS = {
      getDateRange: vi.fn().mockReturnValue({ from: null, to: null }),
      saveDateRange: vi.fn(),
    };
    mockTaskGroupService = {
      year: 2024,
      numeroSemana: 42,
    };
    mockHtmlPrintS = {
      esc: vi.fn((s: string) => String(s)),
      getStandardCss: vi.fn().mockReturnValue("<style></style>"),
      buildStandardHeader: vi.fn().mockReturnValue(""),
      buildStandardFooter: vi.fn().mockReturnValue(""),
      printHtml: vi.fn(),
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskWeeklyReportPreview, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskWeeklyReportPreview],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DateRangeStorageService, useValue: mockDateRangeStorageS },
        { provide: TaskGroupService, useValue: mockTaskGroupService },
        { provide: HtmlPrintService, useValue: mockHtmlPrintS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskWeeklyReportPreview);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.data()).toBeNull();
    expect(component.year).toBe(2024);
    expect(component.numeroSemana).toBe(42);
  });

  it("onLoadData should call api and set data signal", async () => {
    const mockData = [{ id: "1", title: "Weekly Report" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.data()).toEqual(mockData);
  });

  it("exportPdf should build html and call printHtml", async () => {
    const mockData = {
      customerLogo: "http://logo.png",
      customer: "Cliente Demo",
      periodReport: "Semana 42 - 2024",
      tickets: [
        {
          title: "Ticket 1",
          description: "Descripción 1",
          beforeWork: "http://before.png",
          afterWork: null,
        },
      ],
    };
    component.data.set(mockData);

    await component.exportPdf();

    expect(mockApiResponseS.getBlobFileFromFullUrl).toHaveBeenCalledWith(
      "http://logo.png",
    );
    expect(mockApiResponseS.getBlobFileFromFullUrl).toHaveBeenCalledWith(
      "http://before.png",
    );
    expect(mockHtmlPrintS.printHtml).toHaveBeenCalledTimes(1);
    expect(component.exportingPdf()).toBe(false);
  });

  it("exportPdf should do nothing without data", async () => {
    await component.exportPdf();
    expect(mockHtmlPrintS.printHtml).not.toHaveBeenCalled();
  });
});
