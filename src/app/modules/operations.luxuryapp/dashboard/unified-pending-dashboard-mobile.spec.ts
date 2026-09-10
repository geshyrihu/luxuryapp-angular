import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AiService } from "src/app/core/services/ai.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import { vi } from "vitest";
import { UnifiedPendingDashboardMobile } from "./unified-pending-dashboard-mobile";

vi.mock("ng2-pdf-viewer", () => ({ PdfViewerModule: class {} }));

describe("UnifiedPendingDashboardMobile", () => {
  let component: UnifiedPendingDashboardMobile;
  let fixture: ComponentFixture<UnifiedPendingDashboardMobile>;
  let mockApiResponseS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockRouter: any;
  let mockAiService: any;
  let mockSwalService: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn(),
    };
    mockCustomerIdS = { customerId: signal("cust-123") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(undefined),
      sizeMd: "600px",
      sizeLg: "900px",
    };
    mockRouter = { navigateByUrl: vi.fn() };
    mockAiService = { analyzeDashboard: vi.fn() };
    mockSwalService = {
      fire: vi.fn(),
      showLoading: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
    };

    TestBed.overrideComponent(UnifiedPendingDashboardMobile, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [UnifiedPendingDashboardMobile],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: Router, useValue: mockRouter },
        { provide: AiService, useValue: mockAiService },
        { provide: SwalService, useValue: mockSwalService },
      ],
    });

    fixture = TestBed.createComponent(UnifiedPendingDashboardMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start with empty data and loading false", () => {
    expect(component.data().length).toBe(0);
    expect(component.loading()).toBe(false);
  });

  it("should load data when customerId is set", async () => {
    const mockItems = [
      {
        id: "1",
        module: "Tickets",
        title: "Test",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 1,
      },
    ];
    mockApiResponseS.onGetList.mockResolvedValue(mockItems);
    mockCustomerIdS.customerId.set("cust-456");
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.loadedCustomerId()).toBe("cust-456");
    expect(component.allData.length).toBe(1);
    expect(component.data().length).toBe(1);
  });

  it("should filter data by visibleModules input", () => {
    component.allData = [
      {
        id: "1",
        module: "Tickets",
        title: "Ticket 1",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 1,
      },
      {
        id: "2",
        module: "Minutas",
        title: "Minuta 1",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 2,
      },
    ];
    fixture.componentRef.setInput("visibleModules", ["Tickets"]);
    component.filterData();
    expect(component.data().length).toBe(1);
    expect(component.data()[0].module).toBe("Tickets");
  });

  it("onModuleFilterChange should toggle same module to null", () => {
    component.selectedModule.set("Tickets");
    component.onModuleFilterChange("Tickets");
    expect(component.selectedModule()).toBeNull();
  });

  it("onModuleFilterChange should select different module", () => {
    component.onModuleFilterChange("Tickets");
    expect(component.selectedModule()).toBe("Tickets");
  });

  it("getModuleIcon should return correct icon name", () => {
    expect(component.getModuleIcon("Tickets")).toBe("ticket-outline");
    expect(component.getModuleIcon("Minutas")).toBe("document-text-outline");
    expect(component.getModuleIcon("Mantenimiento")).toBe("build-outline");
    expect(component.getModuleIcon("Legal")).toBe("briefcase-outline");
    expect(component.getModuleIcon("Polizas")).toBe("clipboard-outline");
    expect(component.getModuleIcon("Reclutamiento")).toBe("people-outline");
    expect(component.getModuleIcon("Unknown")).toBe("hammer-outline");
  });

  it("getModuleColor should return correct color", () => {
    expect(component.getModuleColor("Tickets")).toBe("primary");
    expect(component.getModuleColor("Minutas")).toBe("warning");
    expect(component.getModuleColor("Mantenimiento")).toBe("success");
    expect(component.getModuleColor("Legal")).toBe("danger");
    expect(component.getModuleColor("Unknown")).toBe("medium");
  });

  it("getSeverityColor should return correct severity color", () => {
    expect(component.getSeverityColor("concluido")).toBe("success");
    expect(component.getSeverityColor("activo")).toBe("success");
    expect(component.getSeverityColor("pendiente")).toBe("warning");
    expect(component.getSeverityColor("proceso")).toBe("primary");
    expect(component.getSeverityColor("vencido")).toBe("danger");
    expect(component.getSeverityColor("unknown")).toBe("medium");
  });

  it("groupedData should group items by module", () => {
    component.allData = [
      {
        id: "1",
        module: "Tickets",
        title: "T1",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 1,
      },
      {
        id: "2",
        module: "Tickets",
        title: "T2",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 2,
      },
      {
        id: "3",
        module: "Minutas",
        title: "M1",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 3,
      },
    ];
    component.filterData();
    const grouped = component.groupedData;
    expect(Object.keys(grouped).length).toBe(2);
    expect(grouped["Tickets"].length).toBe(2);
    expect(grouped["Minutas"].length).toBe(1);
  });

  it("onNavigate should call router.navigateByUrl for polizas with urlRoute", () => {
    const item: any = { module: "Polizas", urlRoute: "/some-route", id: "1" };
    component.onNavigate(item);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/some-route");
  });

  it("onNavigate should handle default case with urlRoute", () => {
    const item: any = { module: "Unknown", urlRoute: "/fallback" };
    component.onNavigate(item);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/fallback");
  });

  it("onNavigate should open ticket dialog for tickets", () => {
    const item: any = {
      module: "Tickets",
      id: "1",
      metadata: { ticketGroupId: "g1" },
      title: "Test Ticket",
    };
    component.onNavigate(item);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it("onNavigate should open service order dialog for mantenimiento", () => {
    const item: any = { module: "Mantenimiento", id: "1" };
    component.onNavigate(item);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it("onNavigate should open minuta dialog for minutas", () => {
    const item: any = {
      module: "Minutas",
      id: "1",
      metadata: { meetingId: "m1", areaResponsable: "2" },
    };
    component.onNavigate(item);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it("onNavigate should open legal ticket dialog for legal", () => {
    const item: any = { module: "Legal", id: "1" };
    component.onNavigate(item);
    expect(mockDialogHandlerS.openDialog).toHaveBeenCalled();
  });

  it("onModalForm should not throw", () => {
    expect(() => component.onModalForm({})).not.toThrow();
  });

  it("generateDailyReport should fire swal if loading or no data", async () => {
    component.loading.set(true);
    await component.generateDailyReport();
    expect(mockSwalService.fire).toHaveBeenCalled();
  });

  it("generateDailyReport should call aiService.analyzeDashboard when data is ready", async () => {
    mockCustomerIdS.customerId.set("cust-123");
    component.loading.set(false);
    component.loadedCustomerId.set("cust-123");
    component.allData = [
      {
        id: "1",
        module: "Tickets",
        title: "Test",
        status: "Pendiente",
        date: "2024-01-01",
        formattedDate: "01/01/2024",
        responsible: "User",
        urlRoute: "/test",
        priority: 1,
      },
    ];
    component.filterData();
    mockAiService.analyzeDashboard.mockResolvedValue("<p>Report</p>");

    await component.generateDailyReport();

    expect(mockSwalService.showLoading).toHaveBeenCalled();
    expect(mockAiService.analyzeDashboard).toHaveBeenCalled();
  });
});
