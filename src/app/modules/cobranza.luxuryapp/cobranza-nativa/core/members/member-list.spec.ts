import { CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import MemberList from "./member-list";
import { EMemberRole } from "../../interfaces/enums";

describe("MemberList", () => {
  let component: MemberList;
  let fixture: ComponentFixture<MemberList>;
  let apiResponseMock: {
    onGetItem: ReturnType<typeof vi.fn>;
    onDelete: ReturnType<typeof vi.fn>;
    onPost: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiResponseMock = {
      onGetItem: vi.fn().mockResolvedValue([]),
      onDelete: vi.fn().mockResolvedValue(true),
      onPost: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [MemberList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn() } },
            params: of({}),
            queryParams: of({}),
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
          provide: DateService,
          useValue: {
            getDateFormat: vi.fn().mockReturnValue("2026-07-31"),
          },
        },
        {
          provide: DialogHandlerService,
          useValue: {
            openDialog: vi.fn().mockResolvedValue(false),
            sizeLg: "lg",
          },
        },
        {
          provide: EnumSelectService,
          useValue: {
            memberRole: () =>
              of([{ label: "Propietario", value: EMemberRole.Owner }]),
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

    fixture = TestBed.createComponent(MemberList);
    component = fixture.componentInstance;
  });

  it("should load property members for the active customer", async () => {
    apiResponseMock.onGetItem.mockResolvedValue([
      {
        id: "member-1",
        customerId: "customer-1",
        propertyId: "property-1",
        userId: "user-1",
        userName: "Ana López",
        email: "ana@example.com",
        memberRole: EMemberRole.Owner,
        isFinancialResponsible: true,
        receiveNotifications: true,
        startDate: "2026-07-01",
        endDate: null,
        isActive: true,
        notes: null,
        accountNumber: "104-001-001-000",
        propertyName: "Torre A / 101",
      },
    ]);

    component.onLoadData();
    await Promise.resolve();

    expect(apiResponseMock.onGetItem).toHaveBeenCalledOnce();
    expect(component.dataSignal()).toHaveLength(1);
    expect(component.dataSignal()[0].userName).toBe("Ana López");
  });

  it("should delete ended membership and refresh list", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockImplementation(() => {});

    await component.onDeleteMember({
      id: "member-1",
      customerId: "customer-1",
      propertyId: "property-1",
      userId: "user-1",
      userName: "Ana López",
      email: "ana@example.com",
      memberRole: EMemberRole.Owner,
      isFinancialResponsible: true,
      receiveNotifications: true,
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      isActive: false,
      notes: null,
      accountNumber: "104-001-001-000",
      propertyName: "Torre A / 101",
    });

    expect(apiResponseMock.onDelete).toHaveBeenCalledOnce();
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it("should end active membership using today's formatted date", async () => {
    const loadSpy = vi.spyOn(component, "onLoadData").mockImplementation(() => {});

    await component.onEndMembership({
      id: "member-1",
      customerId: "customer-1",
      propertyId: "property-1",
      userId: "user-1",
      userName: "Ana López",
      email: "ana@example.com",
      memberRole: EMemberRole.Owner,
      isFinancialResponsible: true,
      receiveNotifications: true,
      startDate: "2026-07-01",
      endDate: null,
      isActive: true,
      notes: null,
      accountNumber: "104-001-001-000",
      propertyName: "Torre A / 101",
    });

    expect(apiResponseMock.onPost).toHaveBeenCalledOnce();
    expect(apiResponseMock.onPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ endDate: "2026-07-31" }),
    );
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  it("should expose role and active state labels", () => {
    expect(component.rolLabel(EMemberRole.Owner)).toBe("Propietario");
    expect(component.activeStatusMeta(true)).toEqual({
      label: "Activo",
      severity: "success",
    });
  });
});
