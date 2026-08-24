import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { vi } from "vitest";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateInterviewFeedbackForm } from "./candidate-interview-feedback-form";

describe("CandidateInterviewFeedbackForm", () => {
  let component: CandidateInterviewFeedbackForm;
  let fixture: ComponentFixture<CandidateInterviewFeedbackForm>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let toastService: ReturnType<typeof vi.fn>;
  let dialogRef: ReturnType<typeof vi.fn>;
  let enumSelectService: { candidateRejectionReason: ReturnType<typeof vi.fn> };
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
    enumSelectService = {
      candidateRejectionReason: vi.fn().mockReturnValue(of([])),
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
        { provide: EnumSelectService, useValue: enumSelectService },
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
      decision: CandidateDecision.EnEspera,
      additionalComment: "Comentario",
    });

    await component.onSubmit();

    expect(apiResponseService.onPost).toHaveBeenCalledWith(
      EndpointsReclutamiento.CandidateProcesses.interviewerAction,
      expect.objectContaining({
        candidateProcessId: "process-1",
        decision: CandidateDecision.EnEspera,
        decisionReason: null,
        additionalComment: "Comentario",
        newScheduledAt: null,
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
    });

    await component.onSubmit();

    expect(apiResponseService.onPost).not.toHaveBeenCalled();
    expect(toastService.showWarn).toHaveBeenCalled();
  });
});
