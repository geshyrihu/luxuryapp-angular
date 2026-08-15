import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { vi } from "vitest";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { InterviewerActionType } from "src/app/core/enums/interviewer-action-type";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CandidateInterviewFeedbackForm } from "./candidate-interview-feedback-form";

describe("CandidateInterviewFeedbackForm", () => {
  let component: CandidateInterviewFeedbackForm;
  let fixture: ComponentFixture<CandidateInterviewFeedbackForm>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let toastService: ReturnType<typeof vi.fn>;
  let dialogRef: ReturnType<typeof vi.fn>;
  let dialogConfig: { data: { candidateApplicationId?: string; candidateProcessId?: string } };

  beforeEach(() => {
    apiResponseService = {
      onGetItem: vi.fn().mockResolvedValue({
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
      }),
      onPost: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };
    toastService = {
      showWarn: vi.fn(),
    };
    dialogRef = {
      close: vi.fn(),
    };
    dialogConfig = {
      data: {
        candidateApplicationId: "application-1",
      },
    };

    TestBed.overrideComponent(CandidateInterviewFeedbackForm, {
      set: {
        template: "<div>Mock</div>",
        imports: [ReactiveFormsModule],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateInterviewFeedbackForm, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseService },
        { provide: CustomToastService, useValue: toastService },
        { provide: DynamicDialogConfig, useValue: dialogConfig },
        { provide: DynamicDialogRef, useValue: dialogRef },
      ],
    });

    fixture = TestBed.createComponent(CandidateInterviewFeedbackForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should resolve candidateProcessId from interview response when only application id is provided", async () => {
    await fixture.whenStable();

    expect(apiResponseService.onGetItem).toHaveBeenCalledWith(
      EndpointsReclutamiento.CandidateProcesses.interviewResponse("application-1"),
      false,
    );
    expect(component.candidateProcessId()).toBe("process-1");
  });

  it("should post process-first feedback to interviewerAction", async () => {
    await fixture.whenStable();

    component.form.patchValue({
      receptionConfirmedAt: "2026-08-15T10:00:00",
      decision: CandidateDecision.EnEspera,
      decisionReasonId: "reason-1",
      additionalComment: "Comentario",
    });

    await component.onSubmit();

    expect(apiResponseService.onPost).toHaveBeenCalledWith(
      EndpointsReclutamiento.CandidateProcesses.interviewerAction,
      expect.objectContaining({
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
        action: InterviewerActionType.SubmitFeedback,
        reasonId: "reason-1",
        comment: "Comentario",
      }),
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it("should warn and skip submit when candidateProcessId is unavailable", async () => {
    apiResponseService.onGetItem.mockResolvedValueOnce({
      candidateApplicationId: "application-1",
      candidateProcessId: null,
    });
    dialogConfig.data = { candidateApplicationId: "application-1" };

    fixture = TestBed.createComponent(CandidateInterviewFeedbackForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({
      decision: CandidateDecision.EnEspera,
      decisionReasonId: "reason-1",
    });

    await component.onSubmit();

    expect(apiResponseService.onPost).not.toHaveBeenCalled();
    expect(toastService.showWarn).toHaveBeenCalled();
  });
});
