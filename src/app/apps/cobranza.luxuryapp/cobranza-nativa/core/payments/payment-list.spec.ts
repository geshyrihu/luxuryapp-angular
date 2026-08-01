import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import PaymentList from "./payment-list";
import { EPaymentMethod, EPaymentStatus } from "../../interfaces/enums";

describe("PaymentList", () => {
  let component: PaymentList;
  let fixture: ComponentFixture<PaymentList>;
  let nativeCollectionUpdate$: Subject<unknown>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
    onPost: ReturnType<typeof vi.fn>;
  };
  let dialogHandlerMock: {
    openDialog: ReturnType<typeof vi.fn>;
    sizeLg: string;
    sizeMd: string;
    sizeSm: string;
  };

  beforeEach(async () => {
    nativeCollectionUpdate$ = new Subject();
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
    };
    dialogHandlerMock = {
      openDialog: vi.fn().mockResolvedValue(false),
      sizeLg: "lg",
      sizeMd: "md",
      sizeSm: "sm",
    };

    await TestBed.configureTestingModule({
      imports: [PaymentList],
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
        { provide: DialogHandlerService, useValue: dialogHandlerMock },
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
            joinNativeCollectionGroup: vi.fn().mockResolvedValue(undefined),
            leaveNativeCollectionGroup: vi.fn().mockResolvedValue(undefined),
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

    fixture = TestBed.createComponent(PaymentList);
    component = fixture.componentInstance;
  });

  it("should load customer payments", async () => {
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "payment-1",
        customerId: "customer-1",
        propertyId: "property-1",
        propertyFullName: "Torre A / 101",
        amount: 900,
        allocatedAmount: 600,
        unappliedAmount: 300,
        paymentDate: "2026-07-31",
        method: EPaymentMethod.Cash,
        reference: "REF-001",
        status: EPaymentStatus.Registrado,
      },
    ]);

    await component.onLoadData();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toHaveLength(1);
    expect(component.dataSignal()[0].reference).toBe("REF-001");
  });

  it("should open payment form and refresh list when dialog resolves true", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();
    dialogHandlerMock.openDialog.mockResolvedValue(true);

    component.onModalForm("payment-1");
    await Promise.resolve();

    expect(dialogHandlerMock.openDialog).toHaveBeenCalledOnce();
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it("should cancel payment when a reason is provided", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();
    dialogHandlerMock.openDialog.mockResolvedValue("duplicado");

    await component.onCancelPayment({
      id: "payment-1",
      customerId: "customer-1",
      propertyId: "property-1",
      propertyFullName: "Torre A / 101",
      amount: 900,
      allocatedAmount: 600,
      unappliedAmount: 300,
      paymentDate: "2026-07-31",
      method: EPaymentMethod.Cash,
      reference: "REF-001",
      status: EPaymentStatus.Registrado,
    });

    expect(apiResponseMock.onPost).toHaveBeenCalledOnce();
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it("should describe applied flow for partially allocated payments", () => {
    expect(
      component.getPaymentFlowLabel({
        id: "payment-1",
        customerId: "customer-1",
        propertyId: "property-1",
        propertyFullName: "Torre A / 101",
        amount: 900,
        allocatedAmount: 600,
        unappliedAmount: 300,
        paymentDate: "2026-07-31",
        method: EPaymentMethod.Cash,
        reference: "REF-001",
        status: EPaymentStatus.Registrado,
      }),
    ).toBe("Parcialmente aplicado");
  });

  it("should refresh data when native collection realtime update arrives", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();

    nativeCollectionUpdate$.next({});
    await Promise.resolve();

    expect(loadSpy).toHaveBeenCalled();
  });
});
