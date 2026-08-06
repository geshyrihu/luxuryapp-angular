import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { DepartmentCharges } from "./department-charges";
import { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import { signal } from "@angular/core";

describe("DepartmentCharges", () => {
  let component: DepartmentCharges;
  let fixture: ComponentFixture<DepartmentCharges>;

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
    departments: [],
    towers: [],
    advances: [],
    departmentCharges: [
      {
        accountNumber: "1001",
        accountName: "Dept 1",
        charges: [
          { concept: "CUOTA DE MTTO", amount: 5000, rawAccount: "104-004-072-001" },
          { concept: "CUOTA EXTRAORDINARIA", amount: 2000, rawAccount: "104-004-072-003" },
        ],
        totalCharges: 7000,
      },
    ],
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
    TestBed.overrideComponent(DepartmentCharges, {
      set: {
        template: "<div>Mock DepartmentCharges</div>",
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [DepartmentCharges],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: "CustomerIdService", useValue: mockCustomerIdS },
        { provide: "ApiResponseService", useValue: mockApiResponseS },
        { provide: "TableScrollHeightService", useValue: mockTableScrollHeightS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentCharges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have hasCustomer true when customerId exists", () => {
    expect(component.hasCustomer()).toBeTrue();
  });

  it("should load data on init", async () => {
    mockApiResponseS.onGetItem.and.returnValue(
      Promise.resolve(mockDashboardResponse),
    );
    await fixture.whenStable();
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should map departmentCharges to pivotData", async () => {
    mockApiResponseS.onGetItem.and.returnValue(
      Promise.resolve(mockDashboardResponse),
    );
    await fixture.whenStable();
    const pivotData = component.pivotData();
    expect(pivotData.length).toBe(1);
    expect(pivotData[0].accountNumber).toBe("1001");
    expect(pivotData[0].accountName).toBe("Dept 1");
    expect(pivotData[0].totalCharges).toBe(7000);
  });

  it("should have CONCEPTS_CATALOG loaded", () => {
    expect(component.concepts.length).toBeGreaterThan(0);
    expect(component.concepts[0].id).toBe("001");
  });
});