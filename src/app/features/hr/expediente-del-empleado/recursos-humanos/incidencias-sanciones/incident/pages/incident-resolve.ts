import { Component, inject, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import {
  IncidentDetailDTO,
  IncidentResolveDTO,
} from "../models/incident.interfaces";

interface IIncidentResolveForm {
  investigationStatus: import("@angular/forms").FormControl<number>;
  investigationNotes: import("@angular/forms").FormControl<string>;
  sanctionApplied: import("@angular/forms").FormControl<boolean>;
  decisionRationale: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-incident-resolve",
  templateUrl: "./incident-resolve.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
})
export class IncidentResolveComponent {
  apiS = inject(ApiResponseService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enums = inject(EnumSelectService);

  incidentId = signal<string>("");
  submitting = signal(false);
  form!: FormGroup<IIncidentResolveForm>;

  cb_status = signal<ISelectItem[]>([]);

  ngOnInit(): void {
    this.incidentId.set(this.config.data?.id as string);

    // Cargar selects desde API
    this.enums.investigationStatus().subscribe((options) => {
      this.cb_status.set(options);
    });

    this.form = this.fb.group<IIncidentResolveForm>({
      investigationStatus: this.fb.control(0),
      investigationNotes: this.fb.control(""),
      sanctionApplied: this.fb.control(false),
      decisionRationale: this.fb.control(""),
    });

    if (this.incidentId()) {
      this.onLoadData();
    }
  }

  onLoadData(): void {
    this.apiS
      .onGetItem<IncidentDetailDTO>(`hr/incidents/${this.incidentId()}`)
      .then((result) => {
        if (result) {
          this.form.patchValue({
            investigationStatus: result.investigationStatus,
            investigationNotes: result.investigationNotes || "",
            sanctionApplied: result.sanctionApplied,
            decisionRationale: result.decisionRationale || "",
          });
        }
      });
  }

  onSubmit(): void {
    if (!this.apiS.validateForm(this.form)) return;
    this.submitting.set(true);

    const dto: IncidentResolveDTO = {
      investigationStatus: this.form.value.investigationStatus,
      investigationNotes: this.form.value.investigationNotes || undefined,
      sanctionApplied: this.form.value.sanctionApplied,
      decisionRationale: this.form.value.decisionRationale || undefined,
    };

    this.apiS
      .onPatch<IncidentDetailDTO>(
        `hr/incidents/${this.incidentId()}/resolve`,
        dto,
      )
      .then((result) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  onCancel(): void {
    this.ref.close();
  }
}
