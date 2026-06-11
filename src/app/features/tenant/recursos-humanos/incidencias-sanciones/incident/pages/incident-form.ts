import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TabsModule } from "primeng/tabs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateTimeSignal } from "src/app/core/components/inputs/web/custom-input-date-time-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

import {
  IncidentTypeListDTO,
  SanctionTypeListDTO,
} from "../../../../../configuration/hr-catalog/models/hr-catalog.interfaces";
import { IncidentAttachmentsComponent } from "../components/incident-attachments/incident-attachments";
import { IncidentWitnessesComponent } from "../components/incident-witnesses/incident-witnesses";
import { SuspensionDaysManager } from "../components/suspension-days-manager/suspension-days-manager";
import {
  IncidentAddOrEditDTO,
  IncidentDetailDTO,
} from "../models/incident.interfaces";

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
  imports: [
    ReactiveFormsModule,
    TabsModule,
    DividerModule,
    CustomInputSelectSignal,
    CustomInputDateTimeSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
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
  activeTab = signal("datos");
  incidentTypes = signal<ISelectItem[]>([]);
  sanctionTypes = signal<ISelectItem[]>([]);
  cb_severity = signal<ISelectItem[]>([]);

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

  /** Cierra el diÃ¡logo indicando cambios (recarga la lista padre). */
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

