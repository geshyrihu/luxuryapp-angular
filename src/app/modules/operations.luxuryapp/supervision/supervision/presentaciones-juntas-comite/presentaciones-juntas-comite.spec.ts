import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";

vi.mock("ng2-pdf-viewer", () => ({ PdfViewerModule: class {} }));

import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PresentacionesJuntasComite } from "./presentaciones-juntas-comite";

describe("PresentacionesJuntasComite", () => {
  let component: PresentacionesJuntasComite;
  let fixture: ComponentFixture<PresentacionesJuntasComite>;
  let mockApiResponseS: any;
  let mockDateS: any;
  let mockRangoCalendarioS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockDateS = {
      getDateFormat: vi.fn(() => "2025-01-01"),
      onParseToInputMonth: vi.fn(() => "2025-01"),
    };
    mockRangoCalendarioS = {
      fechaInicial: new Date(2025, 0, 1),
      fechas$: { subscribe: vi.fn() },
      fechasMOnth$: { subscribe: vi.fn() },
    };
    mockTableScrollHeightS = { scrollHeight: "500px" };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(PresentacionesJuntasComite, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PresentacionesJuntasComite],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DateService, useValue: mockDateS },
        { provide: FiltroCalendarService, useValue: mockRangoCalendarioS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PresentacionesJuntasComite);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it("ngOnInit should call onLoadData", async () => {
    component.ngOnInit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it("onLoadData should fetch data and set dataSignal", async () => {
    const mockData = [{ id: 1, title: "Test" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "presentaciones-junta-comite/generales/2025-01-01/",
    );
    expect(component.dataSignal()).toEqual(mockData);
  });
});
