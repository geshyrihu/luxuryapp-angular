import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ComiteVigilanciaList } from "./comite-vigilancia-list";

describe("ComiteVigilanciaList", () => {
  let component: ComiteVigilanciaList;
  let fixture: ComponentFixture<ComiteVigilanciaList>;

  const apiResponseStub = {
    onGetList: vi.fn().mockResolvedValue([
      {
        id: "committee-1",
        customerId: "customer-1",
        propertyMemberId: "member-1",
        nameProperty: "Juan Perez",
        departamento: "Torre 1 - 101",
        celular: "5555555555",
        email: "juan@example.com",
        posicionComite: "Presidente",
      },
    ]),
    onDelete: vi.fn().mockResolvedValue(true),
    onPost: vi.fn().mockResolvedValue(true),
  };

  const dialogHandlerStub = {
    openDialog: vi.fn().mockResolvedValue(true),
    sizeLg: "lg",
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ComiteVigilanciaList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseStub },
        { provide: DialogHandlerService, useValue: dialogHandlerStub },
        { provide: AuthService, useValue: {} },
        { provide: CustomerIdService, useValue: { customerId: vi.fn(() => "customer-1") } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComiteVigilanciaList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should load typed data", async () => {
    fixture.detectChanges();
    await Promise.resolve();

    expect(apiResponseStub.onGetList).toHaveBeenCalledWith(
      "comites-vigilancia/list/customer-1",
    );
    expect(component.dataSignal()[0].posicionComite).toBe("Presidente");
  });

  it("should remove an item after delete", async () => {
    component.dataSignal.set([
      {
        id: "committee-1",
        customerId: "customer-1",
        propertyMemberId: "member-1",
        nameProperty: "Juan Perez",
        departamento: "Torre 1 - 101",
        celular: "5555555555",
        email: "juan@example.com",
        posicionComite: "Presidente",
      },
      {
        id: "committee-2",
        customerId: "customer-1",
        propertyMemberId: "member-2",
        nameProperty: "Ana Ruiz",
        departamento: "Torre 2 - 202",
        celular: "4444444444",
        email: "ana@example.com",
        posicionComite: "Secretario",
      },
    ]);

    await component.onDelete("committee-1");

    expect(component.dataSignal()).toEqual([
      expect.objectContaining({ id: "committee-2" }),
    ]);
  });

  it("should reload data after sending credentials", async () => {
    const onLoadDataSpy = vi
      .spyOn(component, "onLoadData")
      .mockImplementation(() => undefined);

    await component.onSendCredential("committee-1");

    expect(apiResponseStub.onPost).toHaveBeenCalledWith(
      "comites-vigilancia/committee-1/send-credentials",
    );
    expect(onLoadDataSpy).toHaveBeenCalledOnce();
  });
});
