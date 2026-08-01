import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  NativeCollectionRealTimeUpdateDto,
  SignalRService,
} from "src/app/core/services/signalr.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { NativeStatement } from "./native-statement";

describe("NativeStatement", () => {
  let component: NativeStatement;
  let fixture: ComponentFixture<NativeStatement>;
  let nativeCollectionUpdate$: Subject<NativeCollectionRealTimeUpdateDto>;
  let apiResponseMock: {
    onGetSelectItem: ReturnType<typeof vi.fn>;
    onGetItem: ReturnType<typeof vi.fn>;
    onPost: ReturnType<typeof vi.fn>;
    onPreviewPdf: ReturnType<typeof vi.fn>;
    onDownloadFile: ReturnType<typeof vi.fn>;
  };
  let confirmMock: {
    confirm: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    nativeCollectionUpdate$ = new Subject<NativeCollectionRealTimeUpdateDto>();
    apiResponseMock = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(null),
      onPost: vi.fn().mockResolvedValue(true),
      onPreviewPdf: vi.fn().mockResolvedValue(undefined),
      onDownloadFile: vi.fn().mockResolvedValue(undefined),
    };
    confirmMock = {
      confirm: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [NativeStatement],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn() } },
            params: new Subject(),
            queryParams: new Subject(),
          },
        },
        { provide: ApiResponseService, useValue: apiResponseMock },
        { provide: ConfirmService, useValue: confirmMock },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: () => "customer-1",
          },
        },
        {
          provide: SignalRService,
          useValue: {
            nativeCollectionUpdate$,
            start: vi.fn(),
            joinNativeCollectionPropertyGroup: vi.fn().mockResolvedValue(undefined),
            leaveNativeCollectionPropertyGroup: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NativeStatement);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it("should load selectable properties for the active customer", async () => {
    apiResponseMock.onGetSelectItem.mockResolvedValue([
      { label: "Torre A / 101", value: "property-1" },
    ]);

    await component.loadProperties();

    expect(component.properties()).toEqual([
      { label: "Torre A / 101", value: "property-1" },
    ]);
  });

  it("should fetch statement for the selected property", async () => {
    component.propertyIdCtrl.setValue("property-1");
    component.asOfCtrl.setValue("2026-07-31");
    apiResponseMock.onGetItem.mockResolvedValue({
      propertyInfo: {
        propertyId: "property-1",
        propertyName: "Torre A / 101",
        customerName: "Condominio Demo",
        indivisoPercentage: 0.125,
      },
      summary: {
        totalDebt: 1200,
        totalCreditBalance: 0,
        totalToPay: 1200,
      },
      ledger: [],
    });

    await component.searchStatement();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.statement()?.propertyInfo.propertyName).toBe("Torre A / 101");
  });

  it("should send batch statements only after confirmation", async () => {
    component.customerId.set("customer-1");

    await component.sendBatchStatementEmails();

    expect(confirmMock.confirm).toHaveBeenCalledOnce();
    expect(apiResponseMock.onPost).toHaveBeenCalledOnce();
  });

  it("should expose entry severity by type", () => {
    expect(component.entryTypeSeverity("Cargo")).toBe("danger");
    expect(component.entryTypeSeverity("Abono")).toBe("success");
  });

  it("should refresh statement when realtime update matches selected property", async () => {
    component.propertyIdCtrl.setValue("property-1");
    component.statement.set({
      propertyInfo: {
        propertyId: "property-1",
        propertyName: "Torre A / 101",
        customerName: "Condominio Demo",
        indivisoPercentage: 0.125,
      },
      summary: {
        totalDebt: 1200,
        totalCreditBalance: 0,
        totalToPay: 1200,
      },
      ledger: [],
    });
    const searchSpy = vi.spyOn(component, "searchStatement").mockResolvedValue();

    nativeCollectionUpdate$.next({
      customerId: "customer-1",
      propertyId: "property-1",
      chargeId: null,
      paymentId: null,
      allocationId: null,
      eventType: "charge",
      action: "updated",
      description: null,
      occurredAtUtc: "2026-07-31T20:00:00Z",
    });
    await Promise.resolve();

    expect(searchSpy).toHaveBeenCalled();
  });
});
