import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { PaymentForm } from "./payment-form";
import { EPaymentMethod, EPaymentStatus } from "../../interfaces/enums";

describe("PaymentForm", () => {
  let component: PaymentForm;
  let fixture: ComponentFixture<PaymentForm>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
    onGetSelectItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue(null),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
    };

    await TestBed.configureTestingModule({
      imports: [PaymentForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: { id: "", customerId: "customer-1" } } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ApiResponseService, useValue: apiResponseMock },
        {
          provide: DateService,
          useValue: {
            parseDate: (value: string | null) => (value ? new Date(value) : null),
            getDateFormat: (value: Date | null) =>
              value instanceof Date ? value.toISOString().slice(0, 10) : null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.form.controls.propertyId).toBeDefined();
    expect(component.form.controls.amount).toBeDefined();
  });

  it("should patch form when loadData resolves a payment", async () => {
    vi.spyOn(component["apiResponseS"], "onGetItem").mockResolvedValue({
      propertyId: "property-1",
      amount: 800,
      paymentDate: "2026-07-31",
      method: EPaymentMethod.Cash,
      reference: "REF-001",
      status: EPaymentStatus.Registrado,
    });

    await component.loadData();

    expect(component.form.getRawValue()).toMatchObject({
      propertyId: "property-1",
      amount: 800,
      method: EPaymentMethod.Cash,
      reference: "REF-001",
      status: EPaymentStatus.Registrado,
    });
  });

  it("should disable form for locked statuses", async () => {
    vi.spyOn(component["apiResponseS"], "onGetItem").mockResolvedValue({
      propertyId: "property-1",
      amount: 800,
      paymentDate: "2026-07-31",
      method: EPaymentMethod.Cash,
      reference: "REF-001",
      status: EPaymentStatus.Cancelado,
    });

    await component.loadData();

    expect(component.form.disabled).toBe(true);
  });

  it("should submit through FormHelper", () => {
    const submitSpy = vi.spyOn(FormHelper, "submitCrud").mockImplementation(vi.fn());

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledOnce();
    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        form: component.form,
        id: component.id,
        submitting: component.submitting,
      }),
    );
  });
});
