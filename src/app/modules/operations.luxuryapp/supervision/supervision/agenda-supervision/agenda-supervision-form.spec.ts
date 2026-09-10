import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { vi } from "vitest";
import { AgendaSupervisionForm } from "./agenda-supervision-form";

describe("AgendaSupervisionForm", () => {
  let component: AgendaSupervisionForm;
  let fixture: ComponentFixture<AgendaSupervisionForm>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockDateS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockDateS = {
      getDateNow: vi.fn(() => "2025-01-15"),
      getDateFormat: vi.fn(() => "2025-01-15"),
    };
    mockAuthS = {
      applicationUserId: "user-123",
      userToken: { infoUserAuthDTO: { customerId: "cust-456" } },
    };
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue(null),
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      validateForm: vi.fn(() => true),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
    };
    mockConfig = { data: { id: "" } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(AgendaSupervisionForm, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [AgendaSupervisionForm],
      providers: [
        FormBuilder,
        { provide: DateService, useValue: mockDateS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AgendaSupervisionForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.submitting()).toBe(false);
    expect(component.cb_customer()).toEqual([]);
    expect(component.id).toBe("");
  });

  it("should initialize form with default values", () => {
    expect(component.form).toBeDefined();
    expect(component.form.get("problema")).toBeTruthy();
    expect(component.form.get("solucion")).toBeTruthy();
  });

  it("onLoadSelectItem should fetch customers", async () => {
    const customers = [{ label: "Cust A" }, { label: "Cust B" }];
    mockApiResponseS.onGetSelectItem.mockResolvedValue(customers);

    component.onLoadSelectItem();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith(
      "customers-active",
    );
    expect(component.cb_customer()).toEqual(customers);
  });

  it("submit should call api", () => {
    component.ngOnInit();
    component.submit();
    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
  });

  it("onLoadData should fetch and patch form when id exists", async () => {
    mockConfig.data = { id: "item-1" };
    mockApiResponseS.onGetItem.mockResolvedValue({
      problema: "Test problem",
      solucion: "Test solution",
      fechaConclusion: "2025-01-20",
      fechaSolicitud: "2025-01-10",
    });

    fixture = TestBed.createComponent(AgendaSupervisionForm);
    component = fixture.componentInstance;
    component.ngOnInit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      "agenda-supervision/item-1",
    );
  });
});
