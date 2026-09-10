import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { BankForm } from "./bank-form";
import { FormHelper } from "src/app/core/helpers/form-helper";

describe("BankForm", () => {
  let component: BankForm;
  let fixture: ComponentFixture<BankForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankForm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        {
          provide: DialogService,
          useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) },
        },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {}, params: {}, queryParams: {} },
            params: of({}),
            queryParams: of({}),
          },
        },
        {
          provide: "HttpClientWithoutInterceptors",
          useValue: (globalThis as any).__mockHttpClient,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form group", () => {
    expect(component.form).toBeDefined();
    expect(component.form.get("code")).toBeDefined();
    expect(component.form.get("shortName")).toBeDefined();
    expect(component.form.get("largeName")).toBeDefined();
  });

  it("should have submitting signal initialized as false", () => {
    expect(component.submitting()).toBe(false);
  });

  it("should load bank data when id exists", async () => {
    const payload = {
      code: "BOA",
      shortName: "Bank of America",
      largeName: "The Bank of America Corporation",
    };
    component.id = "bank-id";
    vi.spyOn(component.apiResponseS, "onGetItem").mockResolvedValue(payload);

    await component.onLoadData();

    expect(component.form.getRawValue()).toMatchObject(payload);
  });

  it("should flag duplicate validator when short name starts with code", () => {
    component.form.patchValue({
      code: "BOA",
      shortName: "BoA Financial",
      largeName: "Bank of America",
    });
    component.form.updateValueAndValidity();

    expect(component.form.errors).toEqual({ bankDuplicate: true });
  });

  it("should submit through FormHelper with current form context", () => {
    const submitSpy = vi.spyOn(FormHelper, "submitCrud").mockImplementation(vi.fn());
    component.id = "bank-id";

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalledOnce();
    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        form: component.form,
        api: component.apiResponseS,
        endpoint: "admin/catalogs/banks",
        id: "bank-id",
        ref: component.ref,
        submitting: component.submitting,
      }),
    );
  });
}
