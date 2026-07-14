import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputDateTime } from "@ui/inputs/adaptive/input-date-time/input-date-time";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { TabItem } from "@ui/base/tabs.base";
import {
  IncidentTypeListDTO,
  SanctionTypeListDTO,
} from "src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo/hr-catalog/interfaces/hr-catalog.interfaces";
import { IncidentAttachmentsComponent } from "./incident-attachments/incident-attachments";
import { IncidentWitnessesComponent } from "./incident-witnesses/incident-witnesses";
import {
  IncidentAddOrEditDTO,
  IncidentDetailDTO,
} from "./interfaces/incident.interfaces";
import { SuspensionDaysManager } from "./suspension-days-manager/suspension-days-manager";

interface IIncidentForm {
  employeeId: import("@angular/forms").FormControl<string>;
  incidentTypeId: import("@angular/forms").FormControl<string>;
  description: import("@angular/forms").FormControl<string>;
  incidentDateTime: import("@angular/forms").FormControl<string>;
  severityLevel: import("@angular/forms").FormControl<number>;
  sanctionTypeId: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-incident-form",
  templateUrl: "./incident-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LxTabs,
    CustomInputSelectSignal,
    InputDateTime,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    IncidentAttachmentsComponent,
    IncidentWitnessesComponent,
    SuspensionDaysManager,
  ],
})
export class IncidentFormComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enums = inject(EnumSelectService);

  id = signal<string>("");
  submitting = signal(false);
  activeTab = model<string>("datos");
  tabs = computed<TabItem[]>(() => [
    { id: "datos", label: "📋 Datos" },
    { id: "adjuntos", label: "📎 Adjuntos", disabled: !this.id() },
    { id: "testigos", label: "👤 Testigos", disabled: !this.id() },
    { id: "suspension", label: "📅 Días de Suspensión", disabled: !this.id() },
  ]);
  incidentTypes = signal<SelectItemDto[]>([]);
  sanctionTypes = signal<SelectItemDto[]>([]);
  cb_severity = signal<SelectItemDto[]>([]);

  form!: FormGroup<IIncidentForm>;

  ngOnInit(): void {
    this.id.set(this.config.data?.id ?? "");
    if (this.id()) this.onLoadData();

    this.enums.severityLevel().subscribe((options) => {
      this.cb_severity.set(options);
    });

    const initialEmployeeId = this.config.data?.employeeId ?? "";
    this.form = this.fb.group<IIncidentForm>({
      employeeId: this.fb.control(initialEmployeeId),
      incidentTypeId: this.fb.control("", [Validators.required]),
      description: this.fb.control("", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000),
      ]),
      incidentDateTime: this.fb.control("", [Validators.required]),
      severityLevel: this.fb.control<number>(0, [Validators.required]),
      sanctionTypeId: this.fb.control(""),
    });

    this.apiResponseS
      .onGetList<IncidentTypeListDTO[]>(Endpoints.Settings.incidentTypes)
      .then((resp) => {
        if (resp) {
          this.incidentTypes.set(
            resp
              .filter((t) => t.isActive)
              .map((t) => ({ value: t.id, label: t.name })),
          );
        }
      });

    this.apiResponseS
      .onGetList<SanctionTypeListDTO[]>(Endpoints.Settings.sanctionTypes)
      .then((resp) => {
        if (resp) {
          this.sanctionTypes.set(
            resp
              .filter((t) => t.isActive)
              .map((t) => ({ value: t.id, label: t.name })),
          );
        }
      });
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetItem<IncidentDetailDTO>(Endpoints.HR.Incident.getById(this.id()))
      .then((result) => {
        if (result) {
          this.form.patchValue({
            employeeId:
              result.employeeId ||
              this.form.value.employeeId ||
              this.config.data?.employeeId ||
              "",
            incidentTypeId: result.incidentTypeId,
            description: result.description,
            incidentDateTime: result.incidentDateTime,
            severityLevel: result.severityLevel,
          });
        }
      });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "hr/incidents",
      id: this.id() || null,
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: !!this.id(),
      transformPayload: (value) => this.buildPayload(),
    }).then((result) => {
      if (result !== false && !this.id()) {
        this.id.set(result.id);
        this.activeTab.set("adjuntos");
      }
    });
  }

  /** Cierra el diólogo indicando cambios (recarga la lista padre). */
  onFinish(): void {
    this.ref.close(true);
  }

  private buildPayload(): IncidentAddOrEditDTO {
    const value = this.form.value;
    return {
      employeeId: value.employeeId ?? "",
      customerId: this.customerIdS.customerId(),
      incidentTypeId: value.incidentTypeId ?? "",
      description: value.description ?? "",
      incidentDateTime: value.incidentDateTime
        ? String(value.incidentDateTime).replace(" ", "T")
        : "",
      severityLevel: value.severityLevel,
      sanctionTypeId: value.sanctionTypeId || undefined,
    };
  }
}
