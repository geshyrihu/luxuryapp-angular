import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import ApprovalInbox from "./approval-inbox";
import {
  EFinancialApprovalOperationType,
  EFinancialApprovalStatus,
} from "../../interfaces/enums";

vi.mock("./approval-detail-modal", () => ({
  default: class ApprovalDetailModalMock {},
}));

describe("ApprovalInbox", () => {
  let component: ApprovalInbox;
  let fixture: ComponentFixture<ApprovalInbox>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
  };
  let dialogHandlerMock: {
    openDialog: ReturnType<typeof vi.fn>;
    sizeLg: string;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue([]),
    };
    dialogHandlerMock = {
      openDialog: vi.fn().mockResolvedValue(false),
      sizeLg: "lg",
    };

    await TestBed.configureTestingModule({
      imports: [ApprovalInbox],
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
        { provide: DialogHandlerService, useValue: dialogHandlerMock },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: () => "customer-1",
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

    fixture = TestBed.createComponent(ApprovalInbox);
    component = fixture.componentInstance;
  });

  it("should load pending approvals for the active customer", async () => {
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "approval-1",
        customerId: "customer-1",
        propertyId: "property-1",
        operationType: EFinancialApprovalOperationType.Condonacion,
        status: EFinancialApprovalStatus.Pendiente,
        summary: "Condonación extraordinaria",
        requestedBy: "operador",
        requestedAt: "2026-07-31T10:00:00",
        requestNotes: null,
        operationPayload: null,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
        isExecuted: false,
        executedAt: null,
      },
    ]);

    await component.onLoadData();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toHaveLength(1);
  });

  it("should expose inbox state through the backing signal", () => {
    component.dataSignal.set([
      {
        id: "approval-1",
        customerId: "customer-1",
        propertyId: "property-1",
        operationType: EFinancialApprovalOperationType.Condonacion,
        status: EFinancialApprovalStatus.Pendiente,
        summary: "Condonación extraordinaria",
        requestedBy: "operador",
        requestedAt: "2026-07-31T10:00:00",
        requestNotes: null,
        operationPayload: null,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
        isExecuted: false,
        executedAt: null,
      },
    ]);

    expect(component.dataSignal()).toHaveLength(1);
    expect(component.dataSignal()[0].status).toBe(
      EFinancialApprovalStatus.Pendiente,
    );
  });

  it("should expose operation and status labels", () => {
    expect(
      component.operationLabel(EFinancialApprovalOperationType.ReaperturaPeriodo),
    ).toBe("Reapertura Periodo");
    expect(component.statusLabel(EFinancialApprovalStatus.Pendiente)).toBe(
      "Pendiente",
    );
  });

  it("should expose visual severity for operations and statuses", () => {
    expect(
      component.operationSeverity(
        EFinancialApprovalOperationType.AnulacionCargoPagado,
      ),
    ).toBe("danger");
    expect(component.statusSeverity(EFinancialApprovalStatus.Aprobada)).toBe(
      "success",
    );
  });
});
