import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { ChargeForm } from "./charge-form";
import { EChargeStatus } from "../../interfaces/enums";

describe("ChargeForm", () => {
  let component: ChargeForm;
  let fixture: ComponentFixture<ChargeForm>;
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
      imports: [ChargeForm],
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

    fixture = TestBed.createComponent(ChargeForm);
    component = fixture.componentInstance;
  });

  it("should create", async () => {
    vi.spyOn(component, "loadProperties").mockResolvedValue();
    vi.spyOn(component, "loadTemplates").mockResolvedValue();
    vi.spyOn(component, "loadChargeTypes").mockResolvedValue();

    await component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.form.controls.propertyId).toBeDefined();
    expect(component.form.controls.chargeTypeId).toBeDefined();
  });

  it("should patch form when loadData resolves an existing charge", async () => {
    vi.spyOn(component, "loadProperties").mockResolvedValue();
    vi.spyOn(component, "loadTemplates").mockResolvedValue();
    vi.spyOn(component, "loadChargeTypes").mockResolvedValue();
    await component.ngOnInit();

    vi.spyOn(component["apiResponseS"], "onGetItem").mockResolvedValue({
      propertyId: "property-1",
      chargeTypeId: "type-1",
      concept: "Cargo prueba",
      amount: 1250,
      dueDate: "2026-07-31",
      periodStart: null,
      periodEnd: null,
      status: EChargeStatus.Pendiente,
      generatedAutomatically: false,
      chargeTemplateId: null,
      discountAvailable: null,
      discountDeadline: null,
    });

    await component.loadData();

    expect(component.form.getRawValue()).toMatchObject({
      propertyId: "property-1",
      chargeTypeId: "type-1",
      concept: "Cargo prueba",
      amount: 1250,
      status: EChargeStatus.Pendiente,
    });
  });

  it("should disable form for paid statuses", async () => {
    vi.spyOn(component, "loadProperties").mockResolvedValue();
    vi.spyOn(component, "loadTemplates").mockResolvedValue();
    vi.spyOn(component, "loadChargeTypes").mockResolvedValue();
    await component.ngOnInit();

    vi.spyOn(component["apiResponseS"], "onGetItem").mockResolvedValue({
      propertyId: "property-1",
      chargeTypeId: "type-1",
      concept: "Cargo pagado",
      amount: 500,
      dueDate: "2026-07-31",
      periodStart: null,
      periodEnd: null,
      status: EChargeStatus.Pagado,
      generatedAutomatically: false,
      chargeTemplateId: null,
      discountAvailable: null,
      discountDeadline: null,
    });

    await component.loadData();

    expect(component.form.disabled).toBe(true);
  });

  it("should submit through FormHelper", async () => {
    vi.spyOn(component, "loadProperties").mockResolvedValue();
    vi.spyOn(component, "loadTemplates").mockResolvedValue();
    vi.spyOn(component, "loadChargeTypes").mockResolvedValue();
    await component.ngOnInit();

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
