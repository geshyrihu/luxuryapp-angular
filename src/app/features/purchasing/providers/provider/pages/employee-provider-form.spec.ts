import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { of } from "rxjs";
import { EmployeeInternalService } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employee-internal/services/employee-internal.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { beforeEach, describe } from "vitest";
import { EmployeeProviderForm } from "./employee-provider-form";

describe("EmployeeProviderForm", () => {
  let component: EmployeeProviderForm;
  let fixture: ComponentFixture<EmployeeProviderForm>;
  let mockApiResponseS: any;
  let mockEmployeeS: any;
  let mockConfig: any;
  let mockCustomerIdS: any;
  let mockAuthS: any;
  let mockDateS: any;
  let mockEnumSelectS: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(null),
      onPost: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn(() => true),
    };
    mockEmployeeS = {
      getApplicationRoles: vi.fn().mockResolvedValue([]),
      createEmployee: vi.fn().mockResolvedValue({ id: "emp-001" }),
      createEmployeeExternal: vi.fn().mockResolvedValue({ id: "emp-001" }),
      searchExistingPerson: vi.fn().mockResolvedValue([]),
      searchExistingPhone: vi.fn().mockResolvedValue([]),
    };
    mockConfig = { data: { typePerson: 0 } };
    mockCustomerIdS = { customerId: vi.fn(() => "cust-123") };
    mockAuthS = { applicationUserId: "user-123" };
    mockDateS = { getDateFormat: vi.fn(() => "2024-01-15") };
    mockEnumSelectS = {
      typeContractRegister: vi.fn(() =>
        of([{ value: 1, label: "Tres meses" }]),
      ),
    };
    mockRef = { close: vi.fn() };

    TestBed.overrideComponent(EmployeeProviderForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeProviderForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: EmployeeInternalService, useValue: mockEmployeeS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DateService, useValue: mockDateS },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(EmployeeProviderForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
    expect(component.fase()).toBe(1);
    expect(component.opcion()).toBe("none");
    expect(component.newEmployeeId()).toBe("");
    expect(component.cb_applicationRole()).toEqual([]);
    expect(component.cb_vacantes()).toEqual([]);
    expect(component.cb_typeContractRegister()).toEqual([]);
  });

  it("should load application roles on init", async () => {
    const roles = [{ value: 1, label: "Admin" }];
    mockEmployeeS.getApplicationRoles.mockResolvedValue(roles);

    fixture = TestBed.createComponent(EmployeeProviderForm);
    component = fixture.componentInstance;
    await component.ngOnInit();

    expect(mockEmployeeS.getApplicationRoles).toHaveBeenCalled();
    expect(component.cb_applicationRole()).toEqual(roles);
  });

  it("should pre-select application role when preselectedApplicationRoleId is set", async () => {
    mockConfig.data = { typePerson: 0, applicationRoleId: "2" };
    mockEmployeeS.getApplicationRoles.mockResolvedValue([
      { value: 2, label: "Role 2" },
    ]);

    fixture = TestBed.createComponent(EmployeeProviderForm);
    component = fixture.componentInstance;
    await component.ngOnInit();

    expect(component.form.controls.applicationRoleId.value).toBe("2");
  });

  it("should register employee and move to fase 2 on success", async () => {
    mockEmployeeS.createEmployee.mockResolvedValue({ id: "emp-001" });
    component.form.patchValue({
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-0000",
      email: "john@test.com",
    });

    await component.register();

    expect(mockEmployeeS.createEmployee).toHaveBeenCalled();
    expect(component.newEmployeeId()).toBe("emp-001");
    expect(component.fase()).toBe(2);
  });

  it("should close dialog on register when API returns no employeeId", async () => {
    mockEmployeeS.createEmployee.mockResolvedValue({});

    await component.register();

    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it("should set submitting to false on register failure", async () => {
    mockEmployeeS.createEmployee.mockResolvedValue(false);

    await component.register();

    expect(component.submitting()).toBe(false);
  });

  it("should call createEmployeeExternal when typePerson is not 0", async () => {
    mockConfig.data = { typePerson: 1 };

    fixture = TestBed.createComponent(EmployeeProviderForm);
    component = fixture.componentInstance;
    component.form.patchValue({
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-0000",
      email: "john@test.com",
    });

    await component.register();

    expect(mockEmployeeS.createEmployeeExternal).toHaveBeenCalled();
  });

  it("should set opcion via setOpcion", () => {
    component.setOpcion("alta");
    expect(component.opcion()).toBe("alta");
  });

  it("should close dialog on confirmarFase2 when opcion is none", () => {
    component.onConfirmarFase2();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it("should post recruitment request on confirmarFase2 when opcion is vacante", async () => {
    mockApiResponseS.validateForm.mockReturnValue(true);
    mockApiResponseS.onPost.mockResolvedValue(true);
    component.setOpcion("vacante");
    component.newEmployeeId.set("emp-001");
    component.form.patchValue({ firstName: "John", lastName: "Doe" });
    component.vacanteForm.patchValue({
      positionRequestId: "req-001",
      typeContractRegister: 1,
    });

    component.onConfirmarFase2();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onPost).toHaveBeenCalled();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it("should post alta request on confirmarFase2 when opcion is alta", async () => {
    mockApiResponseS.validateForm.mockReturnValue(true);
    mockApiResponseS.onPost.mockResolvedValue(true);
    component.setOpcion("alta");
    component.newEmployeeId.set("emp-001");
    component.form.patchValue({ firstName: "John", lastName: "Doe" });
    component.altaForm.patchValue({
      positionRequestId: "req-001",
      typeContractRegister: 1,
      boss: "Manager",
      customerAddress: "123 St",
      additionalInformation: "Notes",
    });

    component.onConfirmarFase2();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onPost).toHaveBeenCalled();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it("should build FormData via createFormData", () => {
    component.form.patchValue({
      email: "test@test.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "555-0000",
      applicationRoleId: "1",
    });
    const fd = component["createFormData"](component.form.value);
    expect(fd.get("email")).toBe("test@test.com");
    expect(fd.get("customerId")).toBe("cust-123");
    expect(fd.get("firstName")).toBe("John");
    expect(fd.get("birth")).toBe("2024-01-15");
    expect(fd.get("applicationRoleId")).toBe("1");
  });

  it("should convert file to base64 on change", () => {
    const file = new File([""], "photo.jpg", { type: "image/jpeg" });
    component.change(file);
    expect(component.imagen).toBe(file);
    expect(component.form.value.photoPath).toBe(file);
  });

  it("should search existing person on searchExistingPerson", () => {
    const event = { target: { value: "John Doe" } };
    mockEmployeeS.searchExistingPerson.mockResolvedValue([{ id: "1" }]);
    component.searchExistingPerson(event);
    expect(mockEmployeeS.searchExistingPerson).toHaveBeenCalledWith("John Doe");
  });

  it("should search existing phone on searchExistingPhone", () => {
    const event = { target: { value: "555-0000" } };
    mockEmployeeS.searchExistingPhone.mockResolvedValue([{ id: "1" }]);
    component.searchExistingPhone(event);
    expect(mockEmployeeS.searchExistingPhone).toHaveBeenCalledWith("555-0000");
  });
});
