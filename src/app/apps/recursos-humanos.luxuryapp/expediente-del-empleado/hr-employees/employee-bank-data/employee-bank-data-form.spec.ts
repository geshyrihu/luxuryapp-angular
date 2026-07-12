import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { of } from "rxjs";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { vi } from "vitest";
import { EmployeeInternalService } from "../../employee-internal/services/employee-internal.service";
import { EmployeeBankDataForm } from "./employee-bank-data-form";

describe("EmployeeBankDataForm", () => {
  let fixture: ComponentFixture<EmployeeBankDataForm>;
  let component: EmployeeBankDataForm;

  const mockApiResponseS = {
    onGetSelectItem: vi.fn().mockResolvedValue([{ value: 1, label: "Bank 1" }]),
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  const mockEmployeeInternalS = {
    getBankDataById: vi.fn().mockResolvedValue(null),
  };

  const mockEnumSelectS = {
    relationEmployee: vi
      .fn()
      .mockReturnValue(of([{ value: 1, label: "Relative" }])),
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeBankDataForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeBankDataForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EmployeeInternalService, useValue: mockEmployeeInternalS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { id: "test-id", employeeId: "emp-1" } },
        },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(EmployeeBankDataForm);
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

  it("should call onLoadCombos on init", async () => {
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalled();
  });
});
