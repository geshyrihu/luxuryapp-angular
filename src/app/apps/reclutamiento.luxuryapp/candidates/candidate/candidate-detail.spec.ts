import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "src/app/core/services/dialog-handler.service";
import { CandidateApplicationListItem } from "../candidate-application/interfaces/candidate-application";
import { CandidateDetail } from "./candidate-detail";
import { CandidateDetail as CandidateDetailDto } from "./interfaces/candidate.dto";

const mockApplications: CandidateApplicationListItem[] = [
  {
    id: "app1",
    candidateId: "1",
    requestPositionId: "req1",
    vacancyFolio: "VAC0001",
    positionName: "Desarrollador",
    customerName: "Cliente 1",
    currentStage: 0,
    applicationDate: "2026-01-15T10:00:00Z",
  } as unknown as CandidateApplicationListItem,
];

const mockCandidateDetail: CandidateDetailDto = {
  id: "1",
  fullName: "Juan Perez",
  firstName: "Juan",
  lastName: "Perez",
  phoneNumber: "555-1234",
  email: "juan@example.com",
  age: 30,
  currentAddress: "Calle 123",
  availability: "Inmediata",
  salaryExpectation: 50000,
  experienceSummary: "5 anos experiencia",
  generalComments: "Buen candidato",
  cvFileName: "",
  cvFileUrl: "",
  status: 0,
  applications: mockApplications,
  stageHistory: [],
};

describe("CandidateDetail", () => {
  let component: CandidateDetail;
  let fixture: ComponentFixture<CandidateDetail>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogHandlerService: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetItem: vi
        .fn()
        .mockResolvedValueOnce(mockCandidateDetail)
        .mockResolvedValueOnce(mockCandidateDetail),
    };

    dialogHandlerService = {
      openDialog: vi.fn().mockResolvedValue(false),
      sizeLg: "lg",
    };

    TestBed.overrideComponent(CandidateDetail, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateDetail],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseService },
        { provide: DialogHandlerService, useValue: dialogHandlerService },
        { provide: DynamicDialogConfig, useValue: { data: { id: "1" } } },
      ],
    });

    fixture = TestBed.createComponent(CandidateDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load candidate and applications on init", async () => {
    await fixture.whenStable();

    expect(apiResponseService.onGetItem).toHaveBeenCalledWith(
      EndpointsReclutamiento.Candidates.getById("1"),
    );
    expect(component.detail()?.id).toBe("1");
    expect(component.applications()).toEqual(mockApplications);
  });

  it("should change active tab", () => {
    component.onTabChange({ id: "postulaciones", label: "Postulaciones" });
    expect(component.activeTab()).toBe("postulaciones");
  });

  it("should open add application dialog", async () => {
    dialogHandlerService.openDialog.mockResolvedValueOnce(true);
    component.onAddApplication();
    await fixture.whenStable();

    expect(dialogHandlerService.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      {
        id: "",
        title: "Asignar vacante e iniciar entrevista",
        candidateId: "1",
        allowCreateCandidate: false,
      },
      "Asignar vacante e iniciar entrevista",
      "lg",
    );
  });
});
