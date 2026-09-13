import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import MemberForm from "./member-form";
import { EMemberRole } from "../../interfaces/enums";

describe("MemberForm", () => {
  let component: MemberForm;
  let fixture: ComponentFixture<MemberForm>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue(null),
    };

    await TestBed.configureTestingModule({
      imports: [MemberForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: { id: "", propertyId: "property-1", customerId: "customer-1" } } },
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
        {
          provide: EnumSelectService,
          useValue: {
            memberRole: () => of([{ label: "Propietario", value: EMemberRole.Owner }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(component.userForm.controls.firstName).toBeDefined();
    expect(component.memberForm.controls.memberRole).toBeDefined();
  });

  it("should advance to step 2 when user form is valid", async () => {
    component.ngOnInit();
    component.userForm.patchValue({
      firstName: "Ana",
      lastName: "Lopez",
      email: "ana@example.com",
      phoneNumber: "5551234567",
    });

    await component.onNextStep();

    expect(component.step()).toBe(2);
  });

  it("should patch member form when loadData resolves", async () => {
    component.ngOnInit();
    vi.spyOn(component["apiResponseS"], "onGetItem").mockResolvedValue({
      memberRole: EMemberRole.Tenant,
      isFinancialResponsible: true,
      receiveNotifications: false,
      startDate: "2026-07-01",
      endDate: null,
      notes: "Observaciones",
    });

    await component.loadData();

    expect(component.memberForm.getRawValue()).toMatchObject({
      memberRole: EMemberRole.Tenant,
      isFinancialResponsible: true,
      receiveNotifications: false,
      notes: "Observaciones",
    });
  });

  it("should submit through FormHelper", async () => {
    component.ngOnInit();
    const submitSpy = vi.spyOn(FormHelper, "submitCrud").mockResolvedValue(undefined);

    await component.onSubmit();

    expect(submitSpy).toHaveBeenCalledOnce();
    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        form: component.memberForm,
        submitting: component.submitting,
      }),
    );
  });
});
