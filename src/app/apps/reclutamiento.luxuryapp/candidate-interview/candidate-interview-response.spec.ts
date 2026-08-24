import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { vi } from "vitest";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CandidateInterviewResponse } from "./candidate-interview-response";

describe("CandidateInterviewResponse", () => {
  let component: CandidateInterviewResponse;
  let fixture: ComponentFixture<CandidateInterviewResponse>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogHandlerService: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetItem: vi.fn().mockResolvedValue({
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
      }),
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
    };
    dialogHandlerService = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "lg",
    };

    TestBed.overrideComponent(CandidateInterviewResponse, {
      set: {
        template: "<div>Mock</div>",
        imports: [ReactiveFormsModule],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateInterviewResponse, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseService },
        { provide: DialogHandlerService, useValue: dialogHandlerService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                applicationId: "application-1",
                candidateProcessId: "process-1",
              }),
            },
          },
        },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(CandidateInterviewResponse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should open feedback modal with process-first identifiers", async () => {
    await fixture.whenStable();

    component.openFeedbackModal();

    expect(dialogHandlerService.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      {
        candidateApplicationId: "application-1",
        candidateProcessId: "process-1",
      },
      expect.any(String),
      "lg",
    );
  });
});
