import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { ComiteVigilanciaForm } from "./comite-vigilancia-form";

describe("ComiteVigilanciaForm", () => {
  let component: ComiteVigilanciaForm;
  let fixture: ComponentFixture<ComiteVigilanciaForm>;

  const apiResponseStub = {
    onGetSelectItem: vi.fn().mockResolvedValue([
      { label: "Depto 101", value: "member-1" },
    ]),
    onGetItem: vi.fn().mockResolvedValue({
      customerId: "customer-1",
      propertyMemberId: "member-1",
      propertyMemberName: "Juan Perez",
      posicionComite: 1,
    }),
  };

  const enumSelectStub = {
    typePosicionComite: vi.fn(() =>
      of([
        { label: "Presidente", value: 1 },
        { label: "Secretario", value: 2 },
      ]),
    ),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ComiteVigilanciaForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseStub },
        { provide: CustomerIdService, useValue: { customerId: vi.fn(() => "customer-1") } },
        { provide: EnumSelectService, useValue: enumSelectStub },
        { provide: DynamicDialogConfig, useValue: { data: { id: "", nameProperty: "" } } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComiteVigilanciaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load select items on init", async () => {
    await component.onLoadSelectItems();

    expect(apiResponseStub.onGetSelectItem).toHaveBeenCalledOnce();
    expect(component.cb_condomino()).toEqual([
      { label: "Depto 101", value: "member-1" },
    ]);
    expect(component.cb_position()).toEqual([
      { label: "Presidente", value: 1 },
      { label: "Secretario", value: 2 },
    ]);
  });

  it("should patch typed edit data into the form", async () => {
    await component.onLoadSelectItems();
    component.id = "committee-1";

    await component.onLoadData();

    expect(apiResponseStub.onGetItem).toHaveBeenCalledWith(
      "comites-vigilancia/committee-1",
    );
    expect(component.form.getRawValue()).toMatchObject({
      propertyMemberId: "member-1",
      customerId: "customer-1",
      nameProperty: { label: "Depto 101", value: "member-1" },
      ePosicionComite: 1,
    });
  });

  it("should stop safely when edit response is null", async () => {
    apiResponseStub.onGetItem.mockResolvedValueOnce(null);
    await component.onLoadSelectItems();
    component.id = "committee-1";

    await component.onLoadData();

    expect(component.form.getRawValue()).toMatchObject({
      propertyMemberId: null,
      customerId: "customer-1",
      nameProperty: null,
      ePosicionComite: null,
    });
  });

  it("should keep edit ids even when select options do not contain the current value", async () => {
    apiResponseStub.onGetItem.mockResolvedValueOnce({
      customerId: "customer-1",
      propertyMemberId: "member-missing",
      propertyMemberName: "Miembro Legacy",
      posicionComite: 99,
    });
    await component.onLoadSelectItems();
    component.id = "committee-1";

    await component.onLoadData();

    expect(component.form.getRawValue()).toMatchObject({
      propertyMemberId: "member-missing",
      customerId: "customer-1",
      nameProperty: { label: "Miembro Legacy", value: "member-missing" },
      ePosicionComite: 99,
    });
    expect(component.cb_condomino()).toContainEqual({
      label: "Miembro Legacy",
      value: "member-missing",
    });
  });

  it("should use dialog fallback name when edit response does not include property member name", async () => {
    apiResponseStub.onGetItem.mockResolvedValueOnce({
      customerId: "customer-1",
      propertyMemberId: "member-fallback",
      posicionComite: 1,
    });
    component.config.data.nameProperty = "Nombre desde listado";
    await component.onLoadSelectItems();
    component.id = "committee-1";

    await component.onLoadData();

    expect(component.form.getRawValue()).toMatchObject({
      propertyMemberId: "member-fallback",
      nameProperty: {
        label: "Nombre desde listado",
        value: "member-fallback",
      },
      ePosicionComite: 1,
    });
  });

  it("should match property member ids even with different casing", async () => {
    apiResponseStub.onGetSelectItem.mockResolvedValueOnce([
      { label: "Depto 101", value: "019C6C05-E521-79EA-BF10-F6D37520D716" },
    ]);
    apiResponseStub.onGetItem.mockResolvedValueOnce({
      customerId: "customer-1",
      propertyMemberId: "019c6c05-e521-79ea-bf10-f6d37520d716",
      propertyMemberName: "Salomon Salame Micha",
      posicionComite: 2,
    });
    enumSelectStub.typePosicionComite.mockReturnValueOnce(
      of([
        { label: "Presidente", value: 1 },
        { label: "Tesorero", value: 2 },
      ]),
    );

    await component.onLoadSelectItems();
    component.id = "committee-1";

    await component.onLoadData();

    expect(component.form.getRawValue()).toMatchObject({
      propertyMemberId: "019c6c05-e521-79ea-bf10-f6d37520d716",
      nameProperty: {
        label: "Depto 101",
        value: "019C6C05-E521-79EA-BF10-F6D37520D716",
      },
      ePosicionComite: 2,
    });
  });

  it("should submit the normalized payload", () => {
    const submitSpy = vi
      .spyOn(FormHelper, "submitCrud")
      .mockImplementation(vi.fn());

    component.id = "committee-1";
    component.form.patchValue({
      customerId: "customer-1",
      propertyMemberId: "member-1",
      ePosicionComite: 1,
    });

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledOnce();
    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: "comites-vigilancia",
        id: "committee-1",
        transformPayload: expect.any(Function),
      }),
    );

    const payload = submitSpy.mock.calls[0][0].transformPayload();
    expect(payload).toEqual({
      customerId: "customer-1",
      propertyMemberId: "member-1",
      posicionComite: 1,
    });
  });
});
