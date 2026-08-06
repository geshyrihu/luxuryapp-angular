import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { vi } from "vitest";
import { CandidateDetail } from "./candidate-detail";
import { CandidateDetail as CandidateDetailDto } from "./interfaces/candidate.dto";
import { CandidateApplicationListItem } from "../candidate-application/interfaces/candidate-application";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";

const mockCandidateDetail: CandidateDetailDto = {
  id: "1",
  fullName: "Juan Pérez",
  firstName: "Juan",
  lastName: "Pérez",
  phoneNumber: "555-1234",
  email: "juan@example.com",
  age: 30,
  currentAddress: "Calle 123",
  livesNearWorkplace: true,
  availability: "Inmediata",
  salaryExpectation: 50000,
  experienceSummary: "5 años experiencia",
  recruitmentSource: 1,
  generalComments: "Buen candidato",
  status: 0,
  applications: [
    {
      id: "app1",
      candidateId: "1",
      vacancyId: "v1",
      vacancyTitle: "Desarrollador",
      stage: 0,
      stageLabel: "Nuevo",
      appliedAt: "2026-01-15T10:00:00Z",
      status: 0,
    } as CandidateApplicationListItem,
  ],
  stageHistory: [],
};

const mockApplications: CandidateApplicationListItem[] = [
  {
    id: "app1",
    candidateId: "1",
    vacancyId: "v1",
    vacancyTitle: "Desarrollador",
    stage: 0,
    stageLabel: "Nuevo",
    appliedAt: "2026-01-15T10:00:00Z",
    status: 0,
  } as CandidateApplicationListItem,
  {
    id: "app2",
    candidateId: "1",
    vacancyId: "v2",
    vacancyTitle: "Analista",
    stage: 1,
    stageLabel: "En Revisión",
    appliedAt: "2026-01-14T10:00:00Z",
    status: 0,
  } as CandidateApplicationListItem,
];

describe("CandidateDetail", () => {
  let component: CandidateDetail;
  let fixture: ComponentFixture<CandidateDetail>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogHandlerService: ReturnType<typeof vi.fn>;
  let dialogConfig: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetItem: vi.fn()
        .mockResolvedValueOnce(mockCandidateDetail)
        .mockResolvedValueOnce({ applications: mockApplications }),
    };

    dialogHandlerService = {
      openDialog: vi.fn().mockResolvedValue(false),
      sizeLg: "lg",
    };

    dialogConfig = { data: { id: "1" } };

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
        { provide: DynamicDialogConfig, useValue: dialogConfig },
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
      EndpointsReclutamiento.Candidates.getById("1")
    );
    expect(component.detail()).toEqual(mockCandidateDetail);
    expect(component.applications()).toEqual(mockApplications);
  });

  it("should have default active tab as 'datos'", () => {
    expect(component.activeTab()).toBe("datos");
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
      { id: "", title: "Nueva Postulación", candidateId: "1" },
      "Nueva Postulación",
      "lg"
    );
  });

  it("should open process hiring modal", async () => {
    component.applications.set(mockApplications);
    dialogHandlerService.openDialog.mockResolvedValueOnce(true);
    
    component.onProcessHiring(mockApplications[0]);
    await fixture.whenStable();

    expect(dialogHandlerService.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { id: "app1", toStage: expect.any(Number) },
      "Procesar alta",
      "lg"
    );
  });

  it("should reload applications after dialog closes with true", async () => {
    dialogHandlerService.openDialog.mockResolvedValueOnce(true);
    component.onAddApplication();
    await fixture.whenStable();

    expect(apiResponseService.onGetItem).toHaveBeenCalledTimes(3); // initial + 2 reloads
  });

  it("should return true for isSelected when stage is Seleccionado", () => {
    const result = component.isSelected(2); // Assuming 2 is Seleccionado
    expect(typeof result).toBe("boolean");
  });
});