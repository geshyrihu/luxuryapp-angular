import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import ChargeList from "./charge-list";
import { EChargeStatus } from "../../interfaces/enums";

describe("ChargeList", () => {
  let component: ChargeList;
  let fixture: ComponentFixture<ChargeList>;
  let nativeCollectionUpdate$: Subject<unknown>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
    onPost: ReturnType<typeof vi.fn>;
  };
  let dialogHandlerMock: {
    openDialog: ReturnType<typeof vi.fn>;
    sizeLg: string;
  };
  let confirmMock: {
    confirm: ReturnType<typeof vi.fn>;
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
    };
    confirmMock = {
      confirm: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [ChargeList],
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
        {
          provide: CustomToastService,
          useValue: {
            showWarn: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChargeList);
    component = fixture.componentInstance;
  });

  it("should load customer charges", async () => {
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "charge-1",
        customerId: "customer-1",
        propertyId: "property-1",
        propertyFullName: 'Torre A / 101',
        concept: "Cuota julio",
        amount: 1200,
        dueDate: "2026-07-31",
        status: EChargeStatus.Pendiente,
        generatedAutomatically: false,
      },
    ]);

    await component.onLoadData();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toHaveLength(1);
    expect(component.dataSignal()[0].concept).toBe("Cuota julio");
  });

  it("should open modal and refresh list when dialog resolves true", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();
    dialogHandlerMock.openDialog.mockResolvedValue(true);

    component.onModalForm("charge-1");
    await Promise.resolve();

    expect(dialogHandlerMock.openDialog).toHaveBeenCalledOnce();
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it("should cancel charge after confirmation and refresh list", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();

    await component.onCancel({
      id: "charge-1",
      customerId: "customer-1",
      propertyId: "property-1",
      propertyFullName: "Torre A / 101",
      concept: "Cuota julio",
      amount: 1200,
      dueDate: "2026-07-31",
      status: EChargeStatus.Pendiente,
      generatedAutomatically: false,
    });

    expect(confirmMock.confirm).toHaveBeenCalledOnce();
    expect(apiResponseMock.onPost).toHaveBeenCalledOnce();
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it("should expose readable status metadata", () => {
    expect(component.statusMeta(EChargeStatus.Pagado)).toEqual({
      label: "Pagado",
      severity: "success",
    });
  });

  it("should refresh data when native collection realtime update arrives", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockResolvedValue();

    nativeCollectionUpdate$.next({});
    await Promise.resolve();

    expect(loadSpy).toHaveBeenCalled();
  });
});
