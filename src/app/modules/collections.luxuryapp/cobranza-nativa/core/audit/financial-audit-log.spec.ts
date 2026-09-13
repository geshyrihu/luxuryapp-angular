import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import FinancialAuditLog from "./financial-audit-log";

describe("FinancialAuditLog", () => {
  let component: FinancialAuditLog;
  let fixture: ComponentFixture<FinancialAuditLog>;
  let apiResponseMock: {
    onGetSelectItem: ReturnType<typeof vi.fn>;
    onGetItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue([]),
    };

    await TestBed.configureTestingModule({
      imports: [FinancialAuditLog],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn() } },
            params: [],
            queryParams: [],
          },
        },
        { provide: ApiResponseService, useValue: apiResponseMock },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: () => "customer-1",
          },
        },
        {
          provide: DateService,
          useValue: {
            getDateFormat: vi.fn((value) => value ?? null),
          },
        },
        {
          provide: TableScrollHeightService,
          useValue: {
            scrollHeight: signal("400px"),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialAuditLog);
    component = fixture.componentInstance;
  });

  it("should prepend the condominium-wide option to properties", async () => {
    apiResponseMock.onGetSelectItem.mockResolvedValue([
      { label: "Torre A / 101", value: "property-1" },
    ]);

    await component.loadProperties("customer-1");

    expect(component.properties()).toEqual([
      { label: "Todo el condominio", value: "" },
      { label: "Torre A / 101", value: "property-1" },
    ]);
  });

  it("should search by customer when no property is selected", async () => {
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "log-1",
        customerId: "customer-1",
        propertyId: null,
        operationType: "Cobro",
        summary: "Aplicación de pago",
        entityType: null,
        entityId: null,
        actor: "operador",
        occurredAt: "2026-07-31T10:00:00",
        isSuccess: true,
        detail: null,
      },
    ]);

    await component.onSearch();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toHaveLength(1);
  });

  it("should search by property when a property is selected", async () => {
    component.propertyIdCtrl.setValue("property-1");

    await component.onSearch();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(apiResponseMock.onGetItem.mock.calls[0][0]).toContain("property-1");
  });

  it("should expose success and failure metadata", () => {
    expect(component.successMeta(true)).toEqual({
      label: "Exitoso",
      severity: "success",
    });
    expect(component.successMeta(false)).toEqual({
      label: "Fallido",
      severity: "danger",
    });
  });
});
