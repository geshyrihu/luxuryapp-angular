import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { vi } from "vitest";
import { SendOperationReport } from "./send-operation-report";
import { SendOperationReportBaseService } from "./send-operation-report-base.service";

describe("SendOperationReport", () => {
  let component: SendOperationReport;
  let fixture: ComponentFixture<SendOperationReport>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;
  let mockConfig: any;
  let mockPlatformS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockTableScrollHeightS = { scrollHeight: vi.fn().mockReturnValue("600px") };
    mockConfig = { data: { year: 2024, numeroSemana: 42 } };
    mockPlatformS = { isMobile: vi.fn().mockReturnValue(false) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(SendOperationReport, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [SendOperationReport],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: PlatformService, useValue: mockPlatformS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(SendOperationReport);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize service with config data", () => {
    const service = fixture.debugElement.injector.get(SendOperationReportBaseService);
    expect(service.year).toBe(2024);
    expect(service.numeroSemana).toBe(42);
    expect(service.loading()).toBe(true);
  });
});
