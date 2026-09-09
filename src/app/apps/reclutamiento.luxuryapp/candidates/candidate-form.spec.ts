import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { vi } from "vitest";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogHandlerService,
} from "src/app/core/services/dialog-handler.service";
import { CandidateForm } from "./candidate-form";
import { CandidateAddOrEdit } from "./interfaces/candidate.dto";

const mockCandidate: CandidateAddOrEdit = {
  firstName: "Juan",
  lastName: "Perez",
  phoneNumber: "555-1234",
  email: "juan@example.com",
  recruitmentSource: 0,
  recruitmentSourceId: "guid-1",
  currentAddress: "Calle 123",
  availability: "Inmediata",
  salaryExpectation: 50000,
  experienceSummary: "5 anos experiencia",
  generalComments: "Buen candidato",
};

describe("CandidateForm", () => {
  let component: CandidateForm;
  let fixture: ComponentFixture<CandidateForm>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogConfig: ReturnType<typeof vi.fn>;
  let dialogRef: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetItem: vi.fn().mockResolvedValue(mockCandidate),
      onGetSelectItem: vi.fn().mockResolvedValue([
        { label: "Interno", value: "guid-1" },
        { label: "Externo", value: "guid-2" },
      ]),
      onPostFile: vi.fn().mockResolvedValue({ id: "candidate-id" }),
      onPut: vi.fn().mockResolvedValue({ id: "candidate-id" }),
      onDelete: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };

    dialogConfig = { data: { id: "" } };
    dialogRef = { close: vi.fn() };

    TestBed.overrideComponent(CandidateForm, {
      set: {
        template: "<div>Mock</div>",
        imports: [ReactiveFormsModule],
      },
    });

    TestBed.configureTestingModule({
      imports: [CandidateForm, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseService },
        { provide: DialogHandlerService, useValue: { openDialog: vi.fn(), sizeLg: "lg" } },
        { provide: DynamicDialogConfig, useValue: dialogConfig },
        { provide: DynamicDialogRef, useValue: dialogRef },
      ],
    });

    fixture = TestBed.createComponent(CandidateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have required firstName and lastName controls", () => {
    component.form.get("firstName")?.setValue("");
    component.form.get("lastName")?.setValue("");
    component.form.get("recruitmentSourceId")?.setValue(null);

    expect(component.form.get("firstName")?.errors).toEqual(
      expect.objectContaining({ required: true }),
    );
    expect(component.form.get("lastName")?.errors).toEqual(
      expect.objectContaining({ required: true }),
    );
    expect(component.form.get("recruitmentSourceId")?.errors).toEqual(
      expect.objectContaining({ required: true }),
    );
  });

  it("should load candidate data when onLoadData is called for an existing id", async () => {
    component.id = "1";

    component.onLoadData();
    await fixture.whenStable();

    expect(apiResponseService.onGetItem).toHaveBeenCalledWith(
      EndpointsReclutamiento.Candidates.getById("1"),
    );
    expect(component.form.value.firstName).toBe("Juan");
    expect(component.form.value.lastName).toBe("Perez");
    expect(component.form.value.recruitmentSource).toBe(0);
    expect(component.form.value.recruitmentSourceId).toBe("guid-1");
  });

  it("should send recruitmentSource in form data on submit", async () => {
    component.form.patchValue({
      firstName: "Juan",
      lastName: "Perez",
      recruitmentSourceId: "guid-1",
    });

    await component.onSubmit();

    expect(apiResponseService.onPostFile).toHaveBeenCalledWith(
      EndpointsReclutamiento.Candidates.base,
      expect.any(FormData),
    );

    const formData = apiResponseService.onPostFile.mock.calls[0][1] as FormData;
    expect(formData.get("RecruitmentSource")).toBe("0");
    expect(formData.get("RecruitmentSourceId")).toBe("guid-1");
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({ id: "candidate-id" }),
    );
  });
});
