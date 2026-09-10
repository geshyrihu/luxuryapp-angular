import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ComitesList } from "./comites-list";

describe("ComitesList", () => {
  let component: ComitesList;
  let fixture: ComponentFixture<ComitesList>;

  const apiResponseStub = {
    onGetList: vi.fn().mockResolvedValue([
      {
        customer: {
          nombreCorto: "Condominio A",
          numeroCliente: "001",
        },
        committeeMembers: [
          {
            id: "committee-1",
            email: "juan@example.com",
            phoneNumber: "5555555555",
            fullName: "Juan Perez",
            posicionComite: "Presidente",
          },
        ],
      },
    ]),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ComitesList],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ApiResponseService, useValue: apiResponseStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComitesList);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should load the legal directories endpoint", async () => {
    fixture.detectChanges();
    await Promise.resolve();

    expect(apiResponseStub.onGetList).toHaveBeenCalledWith(
      "legal-directories/committees",
    );
    expect(component.dataSignal()).toHaveLength(1);
  });

  it("should flatten committee members with customer name", () => {
    component.dataSignal.set([
      {
        customer: {
          nombreCorto: "Condominio A",
          numeroCliente: "001",
        },
        committeeMembers: [
          {
            id: "committee-1",
            email: "juan@example.com",
            phoneNumber: "5555555555",
            fullName: "Juan Perez",
            posicionComite: "Presidente",
          },
        ],
      },
    ]);

    expect(component.flatData()).toEqual([
      {
        id: "committee-1",
        email: "juan@example.com",
        phoneNumber: "5555555555",
        fullName: "Juan Perez",
        posicionComite: "Presidente",
        customerName: "Condominio A",
      },
    ]);
  });
});
