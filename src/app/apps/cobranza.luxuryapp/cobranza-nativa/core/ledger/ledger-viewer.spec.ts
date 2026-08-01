import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import LedgerViewer from "./ledger-viewer";
import { EFinancialEventType } from "../../interfaces/enums";

describe("LedgerViewer", () => {
  let component: LedgerViewer;
  let fixture: ComponentFixture<LedgerViewer>;
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
      imports: [LedgerViewer],
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

    fixture = TestBed.createComponent(LedgerViewer);
    component = fixture.componentInstance;
  });

  it("should load properties for the active customer", async () => {
    apiResponseMock.onGetSelectItem.mockResolvedValue([
      { label: "Torre A / 101", value: "property-1" },
    ]);

    await component.loadProperties("customer-1");

    expect(component.properties()).toEqual([
      { label: "Torre A / 101", value: "property-1" },
    ]);
  });

  it("should search entries and filter by event type", async () => {
    component.propertyIdCtrl.setValue("property-1");
    component.eventTypeCtrl.setValue(EFinancialEventType.RecepcionPago);
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "entry-1",
        customerId: "customer-1",
        propertyId: "property-1",
        batchId: "batch-1",
        eventType: EFinancialEventType.RecepcionPago,
        debitAmount: 0,
        creditAmount: 900,
        effectiveDate: "2026-07-31",
        description: "Pago recibido",
        createdAt: "2026-07-31T10:00:00",
        createdBy: "operador",
        chargeId: null,
        paymentId: "payment-1",
        allocationId: null,
      },
      {
        id: "entry-2",
        customerId: "customer-1",
        propertyId: "property-1",
        batchId: "batch-1",
        eventType: EFinancialEventType.EmisionCargo,
        debitAmount: 900,
        creditAmount: 0,
        effectiveDate: "2026-07-31",
        description: "Cargo emitido",
        createdAt: "2026-07-31T09:00:00",
        createdBy: "operador",
        chargeId: "charge-1",
        paymentId: null,
        allocationId: null,
      },
    ]);

    await component.onSearch();

    expect(component.dataSignal()).toHaveLength(1);
    expect(component.dataSignal()[0].eventType).toBe(
      EFinancialEventType.RecepcionPago,
    );
  });

  it("should clear filters and result set", () => {
    component.propertyIdCtrl.setValue("property-1");
    component.fromCtrl.setValue("2026-07-01");
    component.toCtrl.setValue("2026-07-31");
    component.eventTypeCtrl.setValue(EFinancialEventType.EmisionCargo);
    component.dataSignal.set([
      {
        id: "entry-1",
        customerId: "customer-1",
        propertyId: "property-1",
        batchId: "batch-1",
        eventType: EFinancialEventType.EmisionCargo,
        debitAmount: 900,
        creditAmount: 0,
        effectiveDate: "2026-07-31",
        description: "Cargo emitido",
        createdAt: "2026-07-31T09:00:00",
        createdBy: "operador",
        chargeId: "charge-1",
        paymentId: null,
        allocationId: null,
      },
    ]);

    component.onClear();

    expect(component.propertyIdCtrl.value).toBe("");
    expect(component.dataSignal()).toEqual([]);
  });

  it("should expose visual metadata for payment events", () => {
    expect(component.eventTypeMeta(EFinancialEventType.RecepcionPago)).toEqual({
      label: "Recepción Pago",
      severity: "success",
    });
  });
});
