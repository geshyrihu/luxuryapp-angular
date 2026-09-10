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
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-database-backup-form",
  templateUrl: "./database-backup-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    WebButtonLabel,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputMultiselectSignal,
    CustomInputNumberSignal,
    CustomInputSelectButton,
  ],
})
export class DatabaseBackupForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  isEditMode = signal(false);
  availableDatabases = signal<{ label: string; value: string }[]>([]);
  loadingDatabases = signal(true);
  testingConnection = signal(false);
  editId = signal<string>("");

  readonly destinationOptions = [
    { label: "OneDrive (Graph API)", value: "GraphApi" },
    { label: "Carpeta local", value: "Local" },
  ];

  readonly cronPresets = [
    { label: "Cada hora", value: "0 * * * *" },
    { label: "Cada 6 horas", value: "0 */6 * * *" },
    { label: "Diario 02:00", value: "0 2 * * *" },
    { label: "Diario 06:00", value: "0 6 * * *" },
    { label: "Diario 22:00", value: "0 22 * * *" },
    { label: "Cada Domingo 02:00", value: "0 2 * * 0" },
    { label: "Cada Sabado 02:00", value: "0 2 * * 6" },
    { label: "Primer dia del mes 02:00", value: "0 2 1 * *" },
  ];

  form = new FormGroup({
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    selectedDatabases: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cronExpression: new FormControl<string>("0 2 * * *", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    destinationType: new FormControl<string>("GraphApi", {
      nonNullable: true,
    }),
    localPath: new FormControl<string>("", { nonNullable: true }),
    graphTenantId: new FormControl<string>("", { nonNullable: true }),
    graphClientId: new FormControl<string>("", { nonNullable: true }),
    graphClientSecret: new FormControl<string>("", { nonNullable: true }),
    graphUserEmail: new FormControl<string>("", { nonNullable: true }),
    graphFolderPath: new FormControl<string>("LuxuryAppBackups", {
      nonNullable: true,
    }),
    retentionDays: new FormControl<number>(30, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(365)],
    }),
    isActive: new FormControl<boolean>(true, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadAvailableDatabases();

    const data = this.config.data;
    if (data?.id) {
      this.isEditMode.set(true);
      this.editId.set(data.id);
      this.loadConfig(data.id);
    }
  }

  loadAvailableDatabases(): void {
    this.apiResponseS
      .onGetList<string[]>(Endpoints.DatabaseBackup.databases)
      .then((result) => {
        const options = (result ?? []).map((db) => ({
          label: db,
          value: db,
        }));
        this.availableDatabases.set(options);
        this.loadingDatabases.set(false);
      });
  }

  loadConfig(id: string): void {
    this.apiResponseS
      .onGetItem<any>(Endpoints.DatabaseBackup.configById(id))
      .then((result) => {
        if (result) {
          this.form.patchValue({
            name: result.name,
            description: result.description,
            selectedDatabases: result.selectedDatabases,
            cronExpression: result.cronExpression,
            destinationType: result.destinationType ?? "GraphApi",
            localPath: result.localPath ?? "",
            graphTenantId: result.graphTenantId ?? "",
            graphClientId: result.graphClientId ?? "",
            graphClientSecret: result.graphClientSecret ?? "",
            graphUserEmail: result.graphUserEmail ?? "",
            graphFolderPath: result.graphFolderPath ?? "LuxuryAppBackups",
            retentionDays: result.retentionDays,
            isActive: result.isActive,
          });
        }
      });
  }

  onCronPresetSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.form.controls.cronExpression.setValue(select.value);
    }
  }

  onTestConnection(): void {
    const id = this.editId();
    if (!id) return;

    this.testingConnection.set(true);
    this.apiResponseS
      .onPost(Endpoints.DatabaseBackup.testConnection(id), null)
      .then((result) => {
        this.testingConnection.set(false);
      });
  }

  onSubmit(): void {
    if (this.isEditMode()) {
      this.submitting.set(true);
      const id = this.editId();
      const payload = this.buildPayload();
      this.apiResponseS
        .onPut(Endpoints.DatabaseBackup.update(id), payload)
        .then((result) => {
          this.submitting.set(false);
          if (result !== false) this.ref.close(true);
        });
    } else {
      FormHelper.submitCrud({
        form: this.form,
        api: this.apiResponseS,
        endpoint: Endpoints.DatabaseBackup.store,
        id: "",
        ref: this.ref,
        submitting: this.submitting,
      });
    }
  }

  private buildPayload(): any {
    return {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      selectedDatabases: this.form.controls.selectedDatabases.value,
      cronExpression: this.form.controls.cronExpression.value,
      destinationType: this.form.controls.destinationType.value,
      localPath: this.form.controls.localPath.value,
      graphTenantId: this.form.controls.graphTenantId.value,
      graphClientId: this.form.controls.graphClientId.value,
      graphClientSecret: this.form.controls.graphClientSecret.value,
      graphUserEmail: this.form.controls.graphUserEmail.value,
      graphFolderPath: this.form.controls.graphFolderPath.value,
      retentionDays: this.form.controls.retentionDays.value,
      isActive: this.form.controls.isActive.value,
    };
  }
}
