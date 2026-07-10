import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { vi } from "vitest";
import { EmployeePersonalDataForm } from "./employee-personal-data-form";

describe("EmployeePersonalDataForm", () => {
  let fixture: ComponentFixture<EmployeePersonalDataForm>;
  let component: EmployeePersonalDataForm;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue({
      birth: "1990-01-01",
      bloodType: { value: 1 },
      curp: "CURP123",
      localPhone: "555-1234",
      maritalStatus: { value: 1 },
      nationality: "MX",
      nss: "NSS123",
      rfc: "RFC123",
      sex: { value: 1 },
    }),
    onPut: vi.fn().mockResolvedValue(true),
    validateForm: vi.fn().mockReturnValue(true),
  };

  const mockAuthS = {};
  const mockEnumSelectS = {
    bloodType: vi.fn().mockReturnValue(of([{ value: 1, label: "A+" }])),
    maritalStatus: vi.fn().mockReturnValue(of([{ value: 1, label: "Single" }])),
    sex: vi.fn().mockReturnValue(of([{ value: 1, label: "Male" }])),
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeePersonalDataForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeePersonalDataForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        FormBuilder,
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeePersonalDataForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("employeeId", "emp-1");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
  });

  it("should load personal data on init", async () => {
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should extract value from object", () => {
    expect(component.extractValue({ value: 5 })).toBe(5);
    expect(component.extractValue(null)).toBeNull();
    expect(component.extractValue(3)).toBe(3);
  });

  it("should call onPut on onSubmit when form is valid", () => {
    component.onSubmit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPut).toHaveBeenCalled();
  });
});
