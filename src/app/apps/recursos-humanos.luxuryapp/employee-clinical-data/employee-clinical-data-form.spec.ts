import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { EmployeeInternalService } from "../../employee-internal/services/employee-internal.service";
import { EmployeeClinicalDataForm } from "./employee-clinical-data-form";

describe("EmployeeClinicalDataForm", () => {
  let fixture: ComponentFixture<EmployeeClinicalDataForm>;
  let component: EmployeeClinicalDataForm;

  const mockApiResponseS = {};
  const mockEmployeeInternalS = {
    getClinicalDataById: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeClinicalDataForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeClinicalDataForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EmployeeInternalService, useValue: mockEmployeeInternalS },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { id: "test-id", employeeId: "emp-1" } },
        },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(EmployeeClinicalDataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
  });

  it("should initialize form with config data", () => {
    expect(component.form.controls.id.value).toBe("test-id");
    expect(component.form.controls.employeeId.value).toBe("emp-1");
  });

  it("should load data when id is present", () => {
    expect(mockEmployeeInternalS.getClinicalDataById).toHaveBeenCalledWith(
      "test-id",
    );
  });
});

