import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ProveedorForm } from "./proveedor-form";

describe("ProveedorForm", () => {
  let component: ProveedorForm;
  let fixture: ComponentFixture<ProveedorForm>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockConfig: any;
  let mockCustomerIdS: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetEnumSelectItem: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue({}),
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn(() => true),
    };
    mockAuthS = { applicationUserId: "user-123" };
    mockConfig = { data: {} };
    mockCustomerIdS = { customerId: vi.fn(() => "cust-123") };
    mockRef = { close: vi.fn() };

    TestBed.overrideComponent(ProveedorForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [ProveedorForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ProveedorForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_category()).toEqual([]);
    expect(component.cb_tipoServicio()).toEqual([]);
    expect(component.cb_bancos()).toEqual([]);
    expect(component.rfcCoincidente()).toEqual([]);
  });

  it("should set required validator on constanciaFiscal when id is empty", async () => {
    mockConfig.data = { id: "" };
    mockApiResponseS.onGetSelectItem.mockResolvedValue([]);
    mockApiResponseS.onGetEnumSelectItem.mockResolvedValue([]);

    fixture = TestBed.createComponent(ProveedorForm);
    component = fixture.componentInstance;
    await component.ngOnInit();

    expect(component.form.controls.constanciaFiscal.validator).toBeTruthy();
  });

  it("should load select items and existing item on init when id is provided", async () => {
    const mockItem = { nameProvider: "Test", pathPhoto: "logo.png" };
    mockConfig.data = { id: "prov-001" };
    mockApiResponseS.onGetSelectItem.mockResolvedValue([
      { value: 1, label: "Cat1" },
    ]);
    mockApiResponseS.onGetEnumSelectItem.mockResolvedValue([
      { value: 1, label: "Type1" },
    ]);
    mockApiResponseS.onGetItem.mockResolvedValue(mockItem);

    fixture = TestBed.createComponent(ProveedorForm);
    component = fixture.componentInstance;
    await component.ngOnInit();

    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith("Categories");
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith("Bank");
    expect(mockApiResponseS.onGetEnumSelectItem).toHaveBeenCalledWith(
      "service-type",
    );
    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      "Providers/prov-001/cust-123",
    );
    expect(component.urlLogo).toBe("logo.png");
  });

  it("should call onPost on submit when id is empty", () => {
    component.onSubmit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPost).toHaveBeenCalled();
  });

  it("should call onPut on submit when id is present", () => {
    component.id = "prov-001";
    component.onSubmit();
    expect(mockApiResponseS.onPut).toHaveBeenCalled();
  });

  it("should close dialog on successful submit", async () => {
    mockApiResponseS.onPost.mockResolvedValue(true);
    await component.onSubmit();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it("should set submitting to false on failed submit", async () => {
    mockApiResponseS.onPost.mockResolvedValue(false);
    await component.onSubmit();
    expect(component.submitting()).toBe(false);
  });

  it("should save bank id and name via saveBancoId", () => {
    const item = { value: 5, label: "Banco Test" };
    component.saveBancoId(item);
    expect(component.form.value.bankId).toBe(5);
    expect(component.form.value.bankName).toBe("Banco Test");
  });

  it("should validate RFC when length > 5", () => {
    mockApiResponseS.onGetList.mockResolvedValue([{ name: "Coincidence" }]);
    component.onValidarRFC("ABCDEF");
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "Providers/ValidarRfc/ABCDEF/cust-123",
    );
  });

  it("should build FormData from form value", () => {
    component.form.patchValue({ nameProvider: "Test" });
    const formData = component.onCreateFormData(component.form.value);
    expect(formData.get("nameProvider")).toBe("Test");
    expect(formData.get("applicationUserId")).toBe("user-123");
    expect(formData.get("customerId")).toBe("cust-123");
  });

  it("should update photoFileUpdate and pathPhoto on uploadFile", () => {
    const file = new File([""], "test.png");
    component.uploadFile(file);
    expect(component.photoFileUpdate).toBe(true);
    expect(component.form.value.pathPhoto).toBe(file);
  });

  it("should patch constanciaFiscal on change", () => {
    const file = new File([""], "doc.pdf");
    component.change(file);
    expect(component.form.value.constanciaFiscal).toBe(file);
  });
});
