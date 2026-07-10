import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CronogramaMantenimientoService } from "src/app/core/services/cronograma-mantenimiento.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { vi } from "vitest";
import { CronogramaAnualMantenimiento } from "./cronograma-anual-mantenimiento";

vi.mock("ng2-pdf-viewer", () => ({ PdfViewerModule: class {} }));

let customerIdSignal: ReturnType<typeof signal<string>>;

const apiResponseSMock = {
  onGetItem: vi.fn().mockResolvedValue([]),
};
const customerIdSMock = {
  get customerId() {
    return customerIdSignal;
  },
};
const dialogHandlerSMock = {
  openDialog: vi.fn().mockResolvedValue(true),
  sizeLg: "lg" as any,
};
const cronogramaMantenimientoServiceMock = { data: [] };
const htmlPrintSMock = {
  esc: vi.fn().mockImplementation((s: string) => s),
  getLogoDataUrl: vi.fn().mockResolvedValue("data:image/png;base64,test"),
  getStandardCss: vi.fn().mockReturnValue("<style></style>"),
  buildStandardHeader: vi.fn().mockReturnValue("<header></header>"),
  buildStandardFooter: vi.fn().mockReturnValue("<footer></footer>"),
  printHtml: vi.fn().mockResolvedValue(undefined),
};

describe("CronogramaAnualMantenimiento", () => {
  let component: CronogramaAnualMantenimiento;
  let fixture: ComponentFixture<CronogramaAnualMantenimiento>;

  beforeEach(() => {
    customerIdSignal = signal("");

    TestBed.overrideComponent(CronogramaAnualMantenimiento, {
      set: { template: "<div>Mock</div>", imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [CronogramaAnualMantenimiento, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseSMock },
        { provide: CustomerIdService, useValue: customerIdSMock },
        { provide: DialogHandlerService, useValue: dialogHandlerSMock },
        {
          provide: CronogramaMantenimientoService,
          useValue: cronogramaMantenimientoServiceMock,
        },
        { provide: HtmlPrintService, useValue: htmlPrintSMock },
      ],
    });

    fixture = TestBed.createComponent(CronogramaAnualMantenimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have empty dataSignal initially", () => {
    expect(component.dataSignal()).toEqual([]);
  });

  it("should have loading as true initially", () => {
    expect(component.loading()).toBe(true);
  });

  it("should have 12 meses defined", () => {
    expect(component.meses.length).toBe(12);
  });

  it("should have 9 filtroEquipos defined", () => {
    expect(component.filtroEquipos.length).toBe(9);
  });

  it("onLoadData should fetch and sort data", async () => {
    const items = [
      { id: 2, sistema: "Zeta", nameMachinery: "M2", maintenanceCalendars: [] },
      {
        id: 1,
        sistema: "Alpha",
        nameMachinery: "M1",
        maintenanceCalendars: [],
      },
    ];
    apiResponseSMock.onGetItem.mockResolvedValue(items);
    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.dataSignal()[0].sistema).toBe("Alpha");
    expect(component.dataSignal()[1].sistema).toBe("Zeta");
    expect(component.loading()).toBe(false);
  });

  it("onLoadData should set loading false on error", async () => {
    apiResponseSMock.onGetItem.mockRejectedValue(new Error("fail"));
    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.loading()).toBe(false);
  });

  it("clickButton should update filter and call onLoadData", () => {
    const spy = vi.spyOn(component, "onLoadData");
    const filtro = component.filtroEquipos[1];
    component.clickButton(filtro);
    expect(component.filtroEquiposValue).toBe("amenidades");
    expect(component.filtroId).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it("clickButton should emit messageEvent for pintura", () => {
    const emitSpy = vi.fn();
    component.messageEvent.subscribe(emitSpy);
    const filtro = component.filtroEquipos.find((f) => f.nombre === "pintura")!;
    component.clickButton(filtro);
    expect(emitSpy).toHaveBeenCalledWith("Pintura");
  });

  it('clickButton should emit "preventivo de equipos" for non-pintura', () => {
    const emitSpy = vi.fn();
    component.messageEvent.subscribe(emitSpy);
    const filtro = component.filtroEquipos.find((f) => f.nombre === "equipos")!;
    component.clickButton(filtro);
    expect(emitSpy).toHaveBeenCalledWith("preventivo de equipos");
  });

  it("hasService should return true if month has service", () => {
    const item: any = {
      maintenanceCalendars: [
        { id: 1, month: 1 },
        { id: 2, month: 3 },
      ],
    };
    expect(component.hasService(item, "ENE")).toBe(true);
    expect(component.hasService(item, "FEB")).toBe(false);
    expect(component.hasService(item, "MAR")).toBe(true);
  });

  it("hasService should return false if no maintenanceCalendars", () => {
    const item: any = {};
    expect(component.hasService(item, "ENE")).toBe(false);
  });

  it("getServiceIdForMonth should return correct service id", () => {
    const item: any = {
      maintenanceCalendars: [
        { id: 10, month: 1 },
        { id: 20, month: 2 },
      ],
    };
    expect(component.getServiceIdForMonth(item, "ENE")).toBe(10);
    expect(component.getServiceIdForMonth(item, "FEB")).toBe(20);
    expect(component.getServiceIdForMonth(item, "MAR")).toBeNull();
  });

  it("onModalForm should open dialog and reload on success", async () => {
    const spy = vi.spyOn(component, "onLoadData");
    dialogHandlerSMock.openDialog.mockResolvedValue(true);
    component.onModalForm({ id: 5, task: "edit" });
    await new Promise((resolve) => setTimeout(resolve));
    expect(dialogHandlerSMock.openDialog).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it("onModalForm should open dialog with numeric id", async () => {
    dialogHandlerSMock.openDialog.mockResolvedValue(true);
    component.onModalForm(7);
    await new Promise((resolve) => setTimeout(resolve));
    expect(dialogHandlerSMock.openDialog).toHaveBeenCalled();
  });

  it("trackByFiltro should return filtro.id", () => {
    expect(
      component.trackByFiltro(0, { id: "abc", emoji: "", nombre: "" }),
    ).toBe("abc");
  });

  it("trackByCustomer should return customer.id", () => {
    expect(component.trackByCustomer(0, { id: 42 } as any)).toBe(42);
  });

  it("trackByItem should return index", () => {
    expect(component.trackByItem(5, {})).toBe(5);
  });

  it("onMobileMonthChange should update selectedMobileMonth", () => {
    component.onMobileMonthChange({ detail: { value: 6 } });
    expect(component.selectedMobileMonth()).toBe(6);
  });

  it("getFiltroIconClass should call resolveIconifyIcon", () => {
    const result = component.getFiltroIconClass(null);
    expect(result).toBeDefined();
  });
});
