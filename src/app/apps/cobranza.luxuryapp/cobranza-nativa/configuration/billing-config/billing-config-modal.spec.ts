import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import BillingConfigModal from "./billing-config-modal";

describe("BillingConfigModal", () => {
  let component: BillingConfigModal;
  let fixture: ComponentFixture<BillingConfigModal>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
    onPost: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue(null),
      onPost: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [BillingConfigModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: { customerId: "customer-1" } } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ApiResponseService, useValue: apiResponseMock },
        {
          provide: EnumSelectService,
          useValue: {
            billingMode: () => of([{ label: "Nativa", value: 0 }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingConfigModal);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.form.get("billingMode")).toBeDefined();
    expect(component.form.get("isEmailEnabled")).toBeDefined();
  });

  it("should patch form when loadData resolves billing and notifications", async () => {
    component.buildForm();
    const getItemSpy = vi.spyOn(component["apiResponseS"], "onGetItem");
    getItemSpy
      .mockResolvedValueOnce({
        billingMode: 0,
        defaultDueDays: 15,
        graceDays: 3,
        globalLateFeePercentage: 8,
      })
      .mockResolvedValueOnce({
        isEmailEnabled: false,
        isPushNotificationEnabled: true,
      });

    await component.loadData();

    expect(component.form.getRawValue()).toMatchObject({
      billingMode: 0,
      defaultDueDays: 15,
      graceDays: 3,
      globalLateFeePercentage: 8,
      isEmailEnabled: false,
      isPushNotificationEnabled: true,
    });
  });

  it("should stop submit when form is invalid", async () => {
    component.buildForm();
    component.form.patchValue({ defaultDueDays: -1 });
    const postSpy = vi.spyOn(component["apiResponseS"], "onPost");

    await component.onSubmit();

    expect(postSpy).not.toHaveBeenCalled();
  });

  it("should close dialog when both saves succeed", async () => {
    component.ngOnInit();
    const postSpy = vi.spyOn(component["apiResponseS"], "onPost").mockResolvedValue(true);
    const closeSpy = vi.spyOn(component["ref"], "close");

    await component.onSubmit();

    expect(postSpy).toHaveBeenCalledTimes(2);
    expect(closeSpy).toHaveBeenCalledWith(true);
  });
});
