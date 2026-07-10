import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { PropiedadesForm } from "./propiedades-form";

describe("PropiedadesForm", () => {
  let component: PropiedadesForm;
  let fixture: ComponentFixture<PropiedadesForm>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockConfig: any;
  let mockRef: any;
  let mockCustomerIdS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue(null),
      onGetList: vi.fn().mockResolvedValue([]),
      validateForm: vi.fn(() => true),
    };
    mockAuthS = { applicationUserId: "user-456" };
    mockConfig = { data: { id: "" } };
    mockRef = { close: vi.fn() };
    mockCustomerIdS = { customerId: signal("cust-123") };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(PropiedadesForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PropiedadesForm],
      providers: [
        FormBuilder,
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PropiedadesForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.submitting()).toBe(false);
    expect(component.cuentasCoi()).toEqual([]);
    expect(component.id).toBe("");
  });

  it("should initialize form on ngOnInit with empty id", () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.form.get("department")).toBeTruthy();
    expect(mockApiResponseS.onGetItem).not.toHaveBeenCalled();
  });

  it("should load data on ngOnInit when id is provided", () => {
    mockConfig.data = { id: "prop-1" };
    mockApiResponseS.onGetItem.mockResolvedValue({
      department: "Dept A",
      tower: "Tower 1",
    });

    fixture = TestBed.createComponent(PropiedadesForm);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith("Property/prop-1");
  });

  it("submit should call FormHelper.submitCrud", () => {
    component.ngOnInit();
    component.submit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
  });
});
