import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
import { firstValueFrom } from "rxjs";
import { EmployeeInternalService } from "src/app/shared/integration/recursos-humanos";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { imageToBase64 } from "src/app/core/helpers/enumeration";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { UserInfoDto } from "src/app/core/interfaces/user-info.interface";
import { DateService } from "src/app/core/services/date.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

type Opcion = "none" | "vacante" | "alta";

@Component({
  selector: "app-employee-provider-form",
  templateUrl: "./employee-provider-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomInputTextSignal,
    InputMask,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    InputImg,
    WebButtonLabelSave,
    CustomInputTextAreaSignal,
  ],
})
export class EmployeeProviderForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  employeeS = inject(EmployeeInternalService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  enumSelectS = inject(EnumSelectService);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  fase = signal<1 | 2>(1);
  opcion = signal<Opcion>("none");
  newEmployeeId = signal<string>("");

  /** Vacante pre-seleccionada cuando se abre el form desde un puesto vacante. */
  readonly preselectedPositionRequestId: string | null =
    this.config.data?.positionRequestId ?? null;

  /** Rol del puesto vacante é pre-llena applicationRoleId en fase 1. */
  readonly preselectedApplicationRoleId: string | null =
    this.config.data?.applicationRoleId ?? null;

  imgBase64: string = "";
  typePerson: any = this.config.data.typePerson;

  imagen: File | null = null;
  cb_applicationRole = signal<SelectItemDto[]>([]);
  cb_vacantes = signal<SelectItemDto[]>([]);
  cb_typeContractRegister = signal<SelectItemDto[]>([]);

  data: UserInfoDto;
  existingPerson: any[] = [];
  existingPhone: any[] = [];

  form = new FormGroup({
    firstName: new FormControl<string>("", Validators.required),
    lastName: new FormControl<string>("", Validators.required),
    phoneNumber: new FormControl<string>("", Validators.required),
    applicationRoleId: new FormControl<number | string>(
      "",
      Validators.required,
    ),
    photoPath: new FormControl<File | string>("", Validators.required),
    typePerson: new FormControl<number>(this.typePerson, Validators.required),
    birth: new FormControl<Date | string>("", Validators.required),
    email: new FormControl<string>("", [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
    ]),
  });

  altaForm = new FormGroup({
    positionRequestId: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    typeContractRegister: new FormControl<number | null>(
      null,
      Validators.required,
    ),
    boss: new FormControl<string>("", Validators.required),
    customerAddress: new FormControl<string>("", Validators.required),
    additionalInformation: new FormControl<string>(""),
  });

  vacanteForm = new FormGroup({
    positionRequestId: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    typeContractRegister: new FormControl<number | null>(
      null,
      Validators.required,
    ),
  });

  preselectedCandidateId: string | null =
    this.config.data?.candidateId ?? null;

  vacancyCandidates = signal<any[]>([]);
  candidateControl = new FormControl<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.employeeS.getApplicationRoles().then((response: any) => {
      this.cb_applicationRole.set(response);
      if (this.preselectedApplicationRoleId) {
        this.form.controls.applicationRoleId.setValue(
          this.preselectedApplicationRoleId,
        );
      }
    });

    this.candidateControl.valueChanges.subscribe((candidateId) => {
      if (candidateId) {
        this.preselectedCandidateId = candidateId;
        this.loadCandidateData();
      }
    });

    if (this.preselectedCandidateId) {
      this.loadCandidateData();
    } else if (this.preselectedPositionRequestId) {
      // If we are opening this from a vacancy, fetch candidates in pipeline
      this.loadVacancyCandidates();
    }
  }

  private async loadVacancyCandidates(): Promise<void> {
    try {
      console.log("loadVacancyCandidates called for PositionRequestId:", this.preselectedPositionRequestId);
      const res = await this.apiResponseS.onGetItem<any>(
        `recruitment-candidate-processes/request-position/${this.preselectedPositionRequestId}`
      );
      console.log("Response from recruitment-candidate-processes:", res);
      
      const activeProcesses = res?.activeProcesses || res?.ActiveProcesses || [];
      const historicalProcesses = res?.historicalProcesses || res?.HistoricalProcesses || [];
      const processes = [...activeProcesses, ...historicalProcesses];

      if (processes.length > 0) {
        // Filter by stage 7 (Seleccionado) or 8 (AltaEnProceso)
        const approvedCandidates = processes.filter((c: any) => {
          const stage = c.currentStage ?? c.CurrentStage ?? c.stage ?? c.Stage;
          return stage === 7 || stage === 8 || stage === 'Seleccionado' || stage === 'AltaEnProceso';
        });
        
        console.log("Approved candidates filtered:", approvedCandidates);
        this.vacancyCandidates.set(
          approvedCandidates.map((c: any) => ({
            label: `${c.candidateName ?? c.CandidateName ?? 'Candidato'} (Etapa ${c.currentStage ?? c.CurrentStage ?? ''})`,
            value: c.candidateId ?? c.CandidateId
          }))
        );
      } else {
        console.log("No active or historical processes found");
      }
    } catch (err) {
      console.error('Error fetching vacancy candidates', err);
    }
  }

  private async loadCandidateData(): Promise<void> {
    try {
      const candidate = await this.apiResponseS.onGetItem<any>(`recruitment-candidates/${this.preselectedCandidateId}`);
      if (candidate) {
        this.form.patchValue({
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phoneNumber: candidate.phoneNumber,
        });
        
        // Ejecutar búsqueda de duplicados automáticamente
        if (candidate.email || candidate.phoneNumber) {
          const duplicate = await this.apiResponseS.onGetItem<any>(
            `employee-internal/check-duplicate?email=${candidate.email || ''}&phoneNumber=${candidate.phoneNumber || ''}`
          );

          if (duplicate) {
            const reuse = window.confirm(
              `Se detectó que el candidato ya existe como colaborador: ${duplicate.fullName}.\n\n¿Deseas usar su perfil existente (Reingreso/Transferencia) y pasar directamente a la Fase 2 (Alta a Vacante)?`
            );
            if (reuse) {
              this.newEmployeeId.set(duplicate.employeeId);
              this.fase.set(2);
              this.loadFase2Catalogs();
              return; // Terminamos aquí la fase 1
            }
          }

          const fullName = `${candidate.firstName} ${candidate.lastName}`.trim();
          this.searchExistingPerson({ target: { value: fullName } });
          if (candidate.phoneNumber) {
            this.searchExistingPhone({ target: { value: candidate.phoneNumber } });
          }
        }
      }
    } catch (error) {
      console.error("Error loading candidate data", error);
    }
  }

  private async loadFase2Catalogs(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const [vacantes, tiposContrato, address] = await Promise.all([
      this.apiResponseS.onGetList<SelectItemDto[]>(
        EndpointsReclutamiento.RequestEmployeeRegister.getVacantes(customerId),
      ),
      firstValueFrom(this.enumSelectS.typeContractRegister()),
      this.apiResponseS.onGetItem<any>(`customer-addresses/${customerId}`),
    ]);

    this.cb_vacantes.set(vacantes ?? []);
    this.cb_typeContractRegister.set((tiposContrato as SelectItemDto[]) ?? []);

    // Default: "Por tres meses" (ForThreeMont = 1)
    this.altaForm.controls.typeContractRegister.setValue(1);
    this.vacanteForm.controls.typeContractRegister.setValue(1);

    // Pre-seleccionar vacante si se abrié desde un puesto vacante específico
    if (this.preselectedPositionRequestId) {
      this.altaForm.controls.positionRequestId.setValue(
        this.preselectedPositionRequestId,
      );
      this.vacanteForm.controls.positionRequestId.setValue(
        this.preselectedPositionRequestId,
      );
    }

    if (address) {
      this.altaForm.controls.customerAddress.setValue(
        this.buildFullAddress(address),
      );
    }
  }

  private buildFullAddress(a: any): string {
    const parts: string[] = [];
    if (a.street) parts.push(a.street);
    if (a.number) parts.push(a.number);
    if (a.unitNumber) parts.push(`Int. ${a.unitNumber}`);
    if (a.district) parts.push(`Col. ${a.district}`);
    if (a.postalCode) parts.push(a.postalCode);
    if (a.townHall) parts.push(a.townHall);
    if (a.city) parts.push(a.city);
    if (a.country) parts.push(a.country);
    return parts.join(", ");
  }

  register() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting.set(true);
    const request$ =
      this.typePerson == 0
        ? this.employeeS.createEmployee(formData)
        : this.employeeS.createEmployeeExternal(formData);

    return request$.then((result: any) => {
      if (result) {
        const employeeId = result?.id ?? result?.employeeId ?? "";
        if (employeeId) {
          this.newEmployeeId.set(employeeId);
          this.loadFase2Catalogs();
          this.submitting.set(false);
          this.fase.set(2);
        } else {
          this.ref.close(true);
        }
      } else {
        this.submitting.set(false);
      }
    });
  }

  setOpcion(opcion: Opcion): void {
    this.opcion.set(opcion);
  }

  onConfirmarFase2(): void {
    const opcion = this.opcion();

    if (opcion === "none") {
      this.ref.close(true);
      return;
    }

    if (opcion === "vacante") {
      if (!this.apiResponseS.validateForm(this.vacanteForm)) return;
      const { positionRequestId, typeContractRegister } =
        this.vacanteForm.getRawValue();
      this.submitting.set(true);
      this.apiResponseS
        .onPost(
          EndpointsReclutamiento.RecruitmentRequests.solicitudAlta(
            this.authS.applicationUserId,
          ),
          {
            employeeId: this.newEmployeeId(),
            candidateId: this.preselectedCandidateId,
            positionRequestId,
            typeContractRegister,
            candidateName: `${this.form.value.firstName} ${this.form.value.lastName}`,
          },
        )
        .then(() => this.ref.close(true))
        .finally(() => this.submitting.set(false));
    }

    if (opcion === "alta") {
      if (!this.apiResponseS.validateForm(this.altaForm)) return;
      const altaValues = this.altaForm.getRawValue();
      this.submitting.set(true);
      this.apiResponseS
        .onPost(
          EndpointsReclutamiento.RecruitmentRequests.solicitudAlta(
            this.authS.applicationUserId,
          ),
          {
            employeeId: this.newEmployeeId(),
            candidateId: this.preselectedCandidateId,
            positionRequestId: altaValues.positionRequestId,
            typeContractRegister: altaValues.typeContractRegister,
            boss: altaValues.boss,
            customerAddress: altaValues.customerAddress,
            additionalInformation: altaValues.additionalInformation,
            candidateName: `${this.form.value.firstName} ${this.form.value.lastName}`,
          },
        )
        .then(() => this.ref.close(true))
        .finally(() => this.submitting.set(false));
    }
  }

  private createFormData(model: any): FormData {
    const formData = new FormData();
    formData.append("email", model.email);
    formData.append("customerId", this.customerIdS.customerId());
    formData.append("firstName", model.firstName);
    formData.append("birth", this.dateS.getDateFormat(model.birth));
    formData.append("lastName", model.lastName);
    formData.append("phoneNumber", model.phoneNumber);
    formData.append("applicationRoleId", model.applicationRoleId);
    formData.append("typePerson", this.typePerson.toString());
    if (this.imagen) {
      formData.append("photoPath", this.imagen);
    }
    return formData;
  }

  change(file: File): void {
    if (file) {
      imageToBase64(file)
        .then((value: string) => {
          this.imgBase64 = value;
        })
        .catch((error) => console.log(error));
      this.imagen = file;
      this.form.controls.photoPath.setValue(file);
    }
  }

  searchExistingPerson(event: any) {
    const fullName = event.target.value;
    if (fullName.length < 1) return;
    this.existingPerson = [];
    this.employeeS.searchExistingPerson(fullName).then((result: any) => {
      this.existingPerson = result;
    });
  }

  searchExistingPhone(event: any) {
    const phone = event.target.value;
    if (phone.length < 1) return;
    this.existingPhone = [];
    this.employeeS.searchExistingPhone(phone).then((result: any) => {
      this.existingPhone = result;
    });
  }
}
