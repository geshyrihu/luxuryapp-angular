import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { vi } from "vitest";
import { FiltroMinutasArea } from "./filtro-minutas-area";

describe("FiltroMinutasArea", () => {
  let component: FiltroMinutasArea;
  let fixture: ComponentFixture<FiltroMinutasArea>;
  let mockApiResponseS: any;
  let mockConfig: any;
  let mockEnumSelectS: any;
  let mockTableScrollHeightS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
    };
    mockConfig = {
      data: {
        titleEstatus: "Pendiente",
        area: 1,
        estatus: 0,
        meetingId: "meet-1",
        customerName: "Test Customer",
      },
    };
    mockEnumSelectS = { onLoadEnumList: vi.fn() };
    mockTableScrollHeightS = { scrollHeight: "500px" };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(FiltroMinutasArea, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [FiltroMinutasArea],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
        { provide: TableScrollHeightService, useValue: mockTableScrollHeightS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FiltroMinutasArea);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.dataSignal()).toEqual([]);
    expect(component.loading()).toBe(true);
  });

  it("ngOnInit should call onLoadConfInitial and onLoadData", async () => {
    component.ngOnInit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.titleEstatus).toBe("Pendiente");
    expect(component.area).toBe(1);
    expect(component.estatus).toBe(0);
    expect(component.meetingId).toBe("meet-1");
    expect(component.customerName).toBe("Test Customer");
    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "Dashboard/FiltroMinutasArea/meet-1/1/0",
    );
  });

  it("onLoadData should fetch data and set dataSignal", async () => {
    const mockData = [{ id: 1, desc: "Test" }];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);
    component.meetingId = "meet-2";
    component.area = 2;
    component.estatus = 1;

    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetList).toHaveBeenCalledWith(
      "Dashboard/FiltroMinutasArea/meet-2/2/1",
    );
    expect(component.dataSignal()).toEqual(mockData);
  });
});
