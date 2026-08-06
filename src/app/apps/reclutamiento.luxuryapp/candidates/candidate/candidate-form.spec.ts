import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { vi } from "vitest";
import { CandidateForm } from "./candidate-form";
import { CandidateAddOrEdit } from "./interfaces/candidate.dto";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";

const mockCandidate: CandidateAddOrEdit = {
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
};

const mockSelectItems = [
  { value: 1, label: "LinkedIn" },
  { value: 2, label: "Indeed" },
  { value: 3, label: "Referido" },
];

describe("CandidateForm", () => {
  let component: CandidateForm;
  let fixture: ComponentFixture<CandidateForm>;
  let apiResponseService: ReturnType<typeof vi.fn>;
  let dialogConfig: ReturnType<typeof vi.fn>;
  let dialogRef: ReturnType<typeof vi.fn>;
  let enumSelectService: ReturnType<typeof vi.fn>;
  let formHelperSubmitCrud: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiResponseService = {
      onGetItem: vi.fn().mockResolvedValue(mockCandidate),
      onPost: vi.fn().mockResolvedValue({ success: true }),
      onPut: vi.fn().mockResolvedValue({ success: true }),
    };

    dialogConfig = { data: { id: "" } };
    dialogRef = { close: vi.fn() };

    enumSelectService = {
      fuenteReclutamiento: vi.fn(() => of(mockSelectItems)),
    };

    formHelperSubmitCrud = vi.spyOn(FormHelper, "submitCrud").mockResolvedValue(true);

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
        { provide: DynamicDialogConfig, useValue: dialogConfig },
        { provide: DynamicDialogRef, useValue: dialogRef },
        { provide: EnumSelectService, useValue: enumSelectService },
      ],
    });

    fixture = TestBed.createComponent(CandidateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load select items on init", async () => {
    await fixture.whenStable();
    expect(enumSelectService.fuenteReclutamiento).toHaveBeenCalled();
    expect(component.cb_recruitmentSource()).toEqual(mockSelectItems);
  });

  it("should have form with required fields", () => {
    expect(component.form.contains("firstName")).toBe(true);
    expect(component.form.contains("lastName")).toBe(true);
    expect(component.form.get("firstName")?.hasValidator(require("Validators").required)).toBe(true);
    expect(component.form.get("lastName")?.hasValidator(require("Validators").required)).toBe(true);
  });

  it("should have form with maxLength validators", () => {
    const firstNameControl = component.form.get("firstName");
    const lastNameControl = component.form.get("lastName");
    expect(firstNameControl?.hasValidator(require("Validators").maxLength(80))).toBe(true);
    expect(lastNameControl?.hasValidator(require("Validators").maxLength(80))).toBe(true);
  });

  it("should load candidate data when id is provided", async () => {
    const configWithId = { data: { id: "1" } };
    TestBed.overrideProvider(DynamicDialogConfig, { useValue: configWithId });
    
    const fixture2 = TestBed.createComponent(CandidateForm);
    const component2 = fixture2.componentInstance;
    fixture2.detectChanges();
    await fixture2.whenStable();

    expect(apiResponseService.onGetItem).toHaveBeenCalledWith(
      EndpointsReclutamiento.Candidates.getById("1")
    );
    expect(component2.form.value.firstName).toBe("Juan");
    expect(component2.form.value.lastName).toBe("Pérez");
  });

  it("should call submitCrud on submit", () => {
    component.onSubmit();
    expect(formHelperSubmitCrud).toHaveBeenCalledWith(
      expect.objectContaining({
        form: component.form,
        api: apiResponseService,
        endpoint: EndpointsReclutamiento.Candidates.base,
        id: "",
        ref: dialogRef,
        submitting: component.submitting,
      })
    );
  });

  it("should mark submitting signal when submitting", () => {
    expect(component.submitting()).toBe(false);
    component.onSubmit();
    expect(component.submitting()).toBe(true);
  });
});