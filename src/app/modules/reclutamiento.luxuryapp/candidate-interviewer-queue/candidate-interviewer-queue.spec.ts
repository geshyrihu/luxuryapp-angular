import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { vi } from "vitest";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ConfirmService } from "src/app/shared/ui/buttons/shared/confirm.service";
import { CandidateInterviewerQueue } from "./candidate-interviewer-queue";
import { CandidateInterviewerQueueService } from "./candidate-interviewer-queue.service";

describe("CandidateInterviewerQueue", () => {
  let component: CandidateInterviewerQueue;
  let fixture: ComponentFixture<CandidateInterviewerQueue>;
  let queueService: ReturnType<typeof vi.fn>;
  let dialogHandlerService: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    queueService = {
      getInterviewerQueue: vi.fn().mockResolvedValue([
        {
          vacancyFolio: "VAC-1",
          positionName: "Analista",
          customerName: "Cliente",
          vacancyStatus: "Activa",
          candidates: [
            {
              candidateApplicationId: "application-1",
              candidateProcessId: "process-1",
              candidateName: "Pat",
              agendaStatusCode: "feedback",
              agendaStatusLabel: "Feedback",
              pendingAction: "Enviar feedback",
              interviewTypeLabel: "Operaciones",
            },
          ],
        },
      ]),
      executeAction: vi.fn().mockResolvedValue(true),
    };
    dialogHandlerService = {
      openDialog: vi.fn().mockResolvedValue(true),
    };

    TestBed.overrideComponent(CandidateInterviewerQueue, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateInterviewerQueue],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CandidateInterviewerQueueService, useValue: queueService },
        { provide: DialogHandlerService, useValue: dialogHandlerService },
        { provide: ConfirmService, useValue: { confirm: vi.fn().mockResolvedValue(true) } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(CandidateInterviewerQueue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should open feedback dialog with process-first identifiers", async () => {
    await fixture.whenStable();

    const candidate = component.flattenedCandidates()[0];
    await component.onFeedback(candidate);

    expect(dialogHandlerService.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      {
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
      },
      "Retroalimentacion - Pat",
      expect.anything(),
    );
  });

  it("should keep approve flow on interviewerAction service", async () => {
    await fixture.whenStable();

    const candidate = component.flattenedCandidates()[0];
    await component.onApprove(candidate);

    expect(queueService.executeAction).toHaveBeenCalledWith(
      expect.objectContaining({
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
      }),
    );
  });
});
