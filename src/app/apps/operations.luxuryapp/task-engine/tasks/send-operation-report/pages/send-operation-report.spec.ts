import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { vi } from "vitest";
import { SendOperationReport } from "./send-operation-report";

describe("SendOperationReport", () => {
  let component: SendOperationReport;
  let fixture: ComponentFixture<SendOperationReport>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockTableScrollHeightS: any;
  let mockConfig: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockTableScrollHeightS = { scrollHeight: signal("600px") };
    mockConfig = { data: { year: 2024, numeroSemana: 42 } };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(SendOperationReport, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [SendOperationReport],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(SendOperationReport);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default values", () => {
    expect(component.year).toBe(2024);
    expect(component.numeroSemana).toBe(42);
    expect(component.destinatariosSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it("onLoadSelectItem should call api and set signal", async () => {
    const items = [{ email: "test@test.com", nivelPrivacidad: "PARA" }];
    mockApiResponseS.onGetSelectItem.mockResolvedValue(items);

    component.ngOnInit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.destinatariosSignal().length).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it("onSelectAll should select all items", () => {
    component.destinatariosSignal.set([
      {
        email: "a@a.com",
        selectControl: { value: false, setValue: vi.fn() },
        select: false,
      },
    ]);
    component.onSelectAll();
    expect(component.destinatariosSignal()[0].select).toBe(true);
  });

  it("onDeselecteAll should deselect all items", () => {
    component.destinatariosSignal.set([
      {
        email: "a@a.com",
        selectControl: { value: true, setValue: vi.fn() },
        select: true,
      },
    ]);
    component.onDeselecteAll();
    expect(component.destinatariosSignal()[0].select).toBe(false);
  });

  it("onFilterDestinatarios should return filtered list", () => {
    component.destinatariosSignal.set([
      {
        email: "a@a.com",
        nivelPrivacidad: "PARA",
        selectControl: { value: true },
      },
      {
        email: "b@b.com",
        nivelPrivacidad: "CC",
        selectControl: { value: false },
      },
    ]);
    const result = component.onFilterDestinatarios();
    expect(result.length).toBe(1);
    expect(result[0].email).toBe("a@a.com");
  });

  it("onAddCorreo should add email to adicionales", () => {
    component.mostrarPara = true;
    component.form.patchValue({ email: "new@test.com" });
    component.onAddCorreo();
    expect(component.destinatariosAdicionales.length).toBe(1);
    expect(component.destinatariosAdicionales[0].email).toBe("new@test.com");
    expect(component.destinatariosAdicionales[0].nivelPrivacidad).toBe("PARA");
  });

  it("onDeleteDestinatariosAdicionales should remove at index", () => {
    component.destinatariosAdicionales = [
      { email: "a@a.com", nivelPrivacidad: "PARA" },
      { email: "b@b.com", nivelPrivacidad: "CC" },
    ];
    component.onDeleteDestinatariosAdicionales(0);
    expect(component.destinatariosAdicionales.length).toBe(1);
    expect(component.destinatariosAdicionales[0].email).toBe("b@b.com");
  });
});
