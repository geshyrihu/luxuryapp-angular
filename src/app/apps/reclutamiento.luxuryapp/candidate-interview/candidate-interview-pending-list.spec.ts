import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { vi } from "vitest";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CandidateInterviewPendingList } from "./candidate-interview-pending-list";

describe("CandidateInterviewPendingList", () => {
  let component: CandidateInterviewPendingList;
  let fixture: ComponentFixture<CandidateInterviewPendingList>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogHandlerService: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetList: vi
        .fn()
        .mockResolvedValueOnce([
          { id: "application-1", candidateProcessId: "process-1", assignedInterviewerUserId: "user-1" },
        ])
        .mockResolvedValueOnce([
          { id: "application-2", candidateProcessId: "process-2", assignedInterviewerUserId: "user-1" },
        ]),
    };
    dialogHandlerService = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "lg",
    };

    TestBed.overrideComponent(CandidateInterviewPendingList, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateInterviewPendingList],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseService },
        { provide: DialogHandlerService, useValue: dialogHandlerService },
        { provide: PlatformService, useValue: { isMobile: vi.fn().mockReturnValue(false) } },
        { provide: AuthService, useValue: { applicationUserId: "user-1" } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(CandidateInterviewPendingList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should merge interview stages on load", async () => {
    await fixture.whenStable();

    expect(apiResponseService.onGetList).toHaveBeenCalledTimes(2);
    expect(component.dataSignal()).toHaveLength(2);
  });

  it("should open feedback dialog with candidateProcessId", async () => {
    component.onFeedback({
      candidateApplicationId: "application-1",
      candidateProcessId: "process-1",
    });
    await fixture.whenStable();

    expect(dialogHandlerService.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      {
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
      },
      "Retroalimentacion de entrevista",
      "lg",
    );
  });
});
