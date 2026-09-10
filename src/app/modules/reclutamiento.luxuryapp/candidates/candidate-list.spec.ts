import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { CandidateList } from "./candidate-list";
import { CandidateListItem } from "./interfaces/candidate.dto";

const mockCandidateList: CandidateListItem[] = [
  {
    id: "1",
    fullName: "Juan Perez",
    phoneNumber: "555-1234",
    email: "juan@example.com",
    status: CandidateStatus.Active,
    activeApplicationsCount: 2,
    lastUpdatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    fullName: "Maria Garcia",
    phoneNumber: "555-5678",
    email: "maria@example.com",
    status: CandidateStatus.Archived,
    activeApplicationsCount: 0,
    lastUpdatedAt: "2026-01-14T10:00:00Z",
  },
];

describe("CandidateList", () => {
  let component: CandidateList;
  let fixture: ComponentFixture<CandidateList>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogHandlerService: ReturnType<typeof vi.fn>;
  let platformService: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetList: vi.fn().mockResolvedValue(mockCandidateList),
      onPatch: vi.fn().mockResolvedValue(true),
    };

    dialogHandlerService = {
      openDialog: vi.fn().mockResolvedValue(false),
      sizeLg: "lg",
    };

    platformService = {
      isMobile: vi.fn().mockReturnValue(false),
    };

    TestBed.overrideComponent(CandidateList, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseService },
        { provide: DialogHandlerService, useValue: dialogHandlerService },
        { provide: PlatformService, useValue: platformService },
      ],
    });

    fixture = TestBed.createComponent(CandidateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load candidates on init", async () => {
    await fixture.whenStable();
    expect(apiResponseService.onGetList).toHaveBeenCalledWith(
      EndpointsReclutamiento.Candidates.list,
      { page: 1, recordsNumber: 200 },
    );
    expect(component.dataSignal()).toEqual(mockCandidateList);
  });

  it("should have correct globalFilterFields when data exists", async () => {
    await fixture.whenStable();
    const filterFields = component.globalFilterFields();
    expect(Array.isArray(filterFields)).toBe(true);
    expect(filterFields.length).toBeGreaterThan(0);
  });

  it("should archive candidate", async () => {
    await fixture.whenStable();
    component.onArchive("1");
    await fixture.whenStable();

    expect(apiResponseService.onPatch).toHaveBeenCalledWith(
      EndpointsReclutamiento.Candidates.archive("1"),
      {},
    );
    const archivedCandidate = component.dataSignal().find((c) => c.id === "1");
    expect(archivedCandidate?.status).toBe(CandidateStatus.Archived);
  });

  it("should open form modal for edit", async () => {
    dialogHandlerService.openDialog.mockResolvedValueOnce(true);
    component.onModalForm({ id: "1", title: "Editar candidato" });
    await fixture.whenStable();

    expect(dialogHandlerService.openDialog).toHaveBeenCalled();
    expect(apiResponseService.onGetList).toHaveBeenCalledTimes(2);
  });

  it("should open detail dialog", () => {
    component.onDetail("1");
    expect(dialogHandlerService.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { id: "1" },
      "Detalle del candidato",
      "lg",
    );
  });
});
