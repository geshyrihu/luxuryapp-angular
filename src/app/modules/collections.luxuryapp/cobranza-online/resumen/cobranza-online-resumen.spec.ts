import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CobranzaOnlineResumen } from "./cobranza-online-resumen";
import { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import { signal } from "@angular/core";

describe("CobranzaOnlineResumen", () => {
  let component: CobranzaOnlineResumen;
  let fixture: ComponentFixture<CobranzaOnlineResumen>;

  const mockCustomerIdS = {
    customerId: signal<string | null>("test-customer"),
    customerName: signal<string | null>("Test Customer"),
  };

  const mockApiResponseS = {
    onGetItem: jasmine
      .createSpy("onGetItem")
      .and.returnValue(Promise.resolve(null)),
  };

  const mockTableScrollHeightS = {
    scrollHeight: signal(400),
  };

  const mockDialogHandlerS = {
    openDialog: jasmine
      .createSpy("openDialog")
      .and.returnValue(Promise.resolve(false)),
    sizeMd: "md",
    sizeLg: "lg",
  };

  const mockDashboardResponse: CobranzaOnlineDashboardResponse = {
    customerId: "test-customer",
    year: 2026,
    month: 8,
    kpis: {
      totalDepartments: 10,
      totalDueCurrentMonth: 100000,
      totalCollectedCurrentMonth: 50000,
      netBalanceCurrentMonth: 50000,
    },
    summaries: [],
    departments: [
      {
        summaryAccountId: "1",
        summaryAccountNumber: "1001",
        summaryAccountName: "Dept 1",
        accountId: "1",
        accountNumber: "1001",
        accountName: "Dept 1",
        propertyId: "prop-1",
        propertyFullName: "Property 1",
        balance: 10000,
        maintenanceBalance: 5000,
        extraordinaryBalance: 2000,
        finesBalance: 1000,
        currentMonthCharge: 5000,
        categoryId: "CAT1",
        movementCount: 5,
      },
    ],
    towers: [],
    advances: [],
    departmentCharges: [],
    departmentPayments: [],
    categories: [],
    topDebtors: [],
    currentCharges: {
      maintenance: { total: 10000, collected: 5000, pending: 5000 },
      extraordinary: { total: 5000, collected: 2000, pending: 3000 },
      monthlyFeeTotal: 15000,
      totalDepartmentsByProperty: 10,
      activeTemplates: [],
      additionalIncomes: [],
    },
    syncMetadata: {
      dataSource: "aspel-live",
      lastSyncAt: new Date().toISOString(),
    },
    diagnostics: {},
  };

  beforeEach(async () => {
    TestBed.overrideComponent(CobranzaOnlineResumen, {
      set: {
        template: "<div>Mock CobranzaOnlineResumen</div>",
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [CobranzaOnlineResumen],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: "CustomerIdService", useValue: mockCustomerIdS },
        { provide: "ApiResponseService", useValue: mockApiResponseS },
        { provide: "TableScrollHeightService", useValue: mockTableScrollHeightS },
        { provide: "DialogHandlerService", useValue: mockDialogHandlerS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CobranzaOnlineResumen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have hasCustomer true when customerId exists", () => {
    expect(component.hasCustomer()).toBeTrue();
  });

  it("should load dashboard data on init", async () => {
    mockApiResponseS.onGetItem.and.returnValue(
      Promise.resolve(mockDashboardResponse),
    );
    await fixture.whenStable();
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should compute tableCobranzaPerfecta groups", () => {
    mockApiResponseS.onGetItem.and.returnValue(
      Promise.resolve(mockDashboardResponse),
    );
    fixture.detectChanges();
    const groups = component.tableCobranzaPerfecta();
    expect(groups.length).toBe(4);
    expect(groups.map((g) => g.clasificacion)).toEqual([
      "COBRANZA PERFECTA",
      "MOROSOS",
      "DEUDA CORRIENTE",
      "COBRADO / SIN ADEUDO",
    ]);
  });

  it("should compute tableDeudaCondominos groups", () => {
    mockApiResponseS.onGetItem.and.returnValue(
      Promise.resolve(mockDashboardResponse),
    );
    fixture.detectChanges();
    const groups = component.tableDeudaCondominos();
    expect(groups.length).toBe(4);
    expect(groups.map((g) => g.clasificacion)).toEqual([
      "COBRANZA EXTRAJUDICIAL",
      "MOROSOS",
      "DEUDA CORRIENTE",
      "TOTAL DEUDA",
    ]);
  });
});
