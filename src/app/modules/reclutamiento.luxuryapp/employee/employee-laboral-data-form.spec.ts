import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { vi } from "vitest";
import { EmployeeLaboralDataForm } from "./employee-laboral-data-form";

describe("EmployeeLaboralDataForm", () => {
  let fixture: ComponentFixture<EmployeeLaboralDataForm>;
  let component: EmployeeLaboralDataForm;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue({}),
    onGetSelectItem: vi.fn().mockResolvedValue([]),
    onPut: vi.fn().mockResolvedValue(true),
    validateForm: vi.fn().mockReturnValue(true),
  };

  const mockAuthS = {};
  const mockAspRoleS = {};
  const mockEnumSelectS = {
    typeContract: vi
      .fn()
      .mockReturnValue(of([{ value: 1, label: "Contract" }])),
    educationLevel: vi.fn().mockReturnValue(of([{ value: 1, label: "Level" }])),
  };
  const mockDateS = {
    getDateFormat: vi.fn().mockReturnValue("2024-01-01"),
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeLaboralDataForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeLaboralDataForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: DateService, useValue: mockDateS },
        FormBuilder,
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeeLaboralDataForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("applicationUserId", "user-1");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_type_contract()).toEqual([]);
    expect(component.cb_education_level()).toEqual([]);
    expect(component.cb_customer()).toEqual([]);
  });

  it("should load combos and laboral data on init", () => {
    fixture.detectChanges();
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalled();
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should have AspRole enum exposed", () => {
    expect(component.AspRole).toBeDefined();
  });

  it("should call onPut on onSubmit when form is valid", () => {
    component.onSubmit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPut).toHaveBeenCalled();
  });
});
