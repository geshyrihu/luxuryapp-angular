import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import PeriodClosureDashboard from "./period-closure-dashboard";

describe("PeriodClosureDashboard", () => {
  let component: PeriodClosureDashboard;
  let fixture: ComponentFixture<PeriodClosureDashboard>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
    onPost: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [PeriodClosureDashboard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn() } },
            params: [],
            queryParams: [],
          },
        },
        { provide: ApiResponseService, useValue: apiResponseMock },
        {
          provide: CustomerIdService,
          useValue: {
            customerId: () => "customer-1",
          },
        },
        {
          provide: AuthService,
          useValue: {
            infoUserAuth: {
              fullName: "Administrador Demo",
            },
          },
        },
        {
          provide: TableScrollHeightService,
          useValue: {
            scrollHeight: signal("400px"),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodClosureDashboard);
    component = fixture.componentInstance;
  });

  it("should load period closures for the active customer", async () => {
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "closure-1",
        customerId: "customer-1",
        year: 2026,
        month: 7,
        isClosed: true,
        closedBy: "Administrador Demo",
        closedAt: "2026-07-31T10:00:00",
        closureNotes: "Cierre mensual",
      },
    ]);

    await component.onLoadData("customer-1");

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toHaveLength(1);
  });

  it("should close the selected period and refresh list", async () => {
    const loadSpy = vi
      .spyOn(component, "onLoadData")
      .mockResolvedValue(undefined);
    component.yearCtrl.setValue(2026);
    component.monthCtrl.setValue(7);
    component.notesCtrl.setValue("Cierre mensual");

    await component.onClosePeriod();

    expect(apiResponseMock.onPost).toHaveBeenCalledOnce();
    expect(apiResponseMock.onPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        year: 2026,
        month: 7,
        closedBy: "Administrador Demo",
      }),
    );
    expect(loadSpy).toHaveBeenCalledWith("customer-1");
  });

  it("should reopen a closed period and refresh list", async () => {
    const loadSpy = vi
      .spyOn(component, "onLoadData")
      .mockResolvedValue(undefined);

    await component.onReopenPeriod({
      id: "closure-1",
      customerId: "customer-1",
      year: 2026,
      month: 7,
      isClosed: true,
      closedBy: "Administrador Demo",
      closedAt: "2026-07-31T10:00:00",
      closureNotes: "Cierre mensual",
    });

    expect(apiResponseMock.onPost).toHaveBeenCalledOnce();
    expect(apiResponseMock.onPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        reopenedBy: "Administrador Demo",
        reason: "Reapertura manual",
      }),
    );
    expect(loadSpy).toHaveBeenCalledWith("customer-1");
  });

  it("should resolve month labels and closed state", () => {
    component.yearCtrl.setValue(2026);
    component.monthCtrl.setValue(7);
    component.dataSignal.set([
      {
        id: "closure-1",
        customerId: "customer-1",
        year: 2026,
        month: 7,
        isClosed: true,
        closedBy: "Administrador Demo",
        closedAt: "2026-07-31T10:00:00",
        closureNotes: "Cierre mensual",
      },
    ]);

    expect(component.monthName(7)).toBe("Julio");
    expect(component.currentPeriodClosed()).toBe(true);
  });
});
