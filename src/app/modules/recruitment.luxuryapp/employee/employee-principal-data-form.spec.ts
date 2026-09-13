import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { EmployeePrincipalDataForm } from "./employee-principal-data-form";

describe("EmployeePrincipalDataForm", () => {
  let fixture: ComponentFixture<EmployeePrincipalDataForm>;
  let component: EmployeePrincipalDataForm;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-1234",
    }),
    onPut: vi.fn().mockResolvedValue(true),
    validateForm: vi.fn().mockReturnValue(true),
  };

  const mockAuthS = {};

  beforeEach(() => {
    TestBed.overrideComponent(EmployeePrincipalDataForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeePrincipalDataForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        FormBuilder,
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeePrincipalDataForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("applicationUserId", "user-1");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
  });

  it("should load principal data on init", () => {
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it("should call onPut on onSubmit when form is valid", () => {
    component.onSubmit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPut).toHaveBeenCalled();
  });
});
