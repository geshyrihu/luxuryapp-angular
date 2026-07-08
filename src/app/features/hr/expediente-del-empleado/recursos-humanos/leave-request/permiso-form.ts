import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputTime } from "@ui/inputs/web/custom-input-time-signal";
import { LxCard } from "@ui/adaptive/card/card";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { SelectedFile } from "src/app/core/interfaces/selected-file";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { LeaveRequestMyDTO } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/interfaces/leave-request.interface";

interface LeaveRequestEditDTO {
  leaveType: number;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

@Component({
  selector: "app-permiso-form",
  templateUrl: "./permiso-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LxCard,
    WebButtonLabel,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTime,
    CustomInputTextAreaSignal,
    CustomInputFile,
    WebButtonLabelSave,
  ],
})
export class PermisoForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  id: string = this.config.data?.id || "";
  submitting = signal(false);
  requestTypes = signal<ISelectItem[]>([]);
  selectedFile: SelectedFile | null = null;
  disabledDates = signal<Date[]>([]);
  leaveMode = signal<"full" | "partial">("full");
  isPartial = computed(() => this.leaveMode() === "partial");

  form = this.formB.nonNullable.group({
    leaveType: [0, [Validators.required]],
    startDate: ["", [Validators.required]],
    endDate: ["", [Validators.required]],
    startTime: [""],
    endTime: [""],
    reason: ["", [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    if (this.id !== "") this.onLoadData();
    this.loadRequestTypes();
    this.loadExistingRequests();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<LeaveRequestEditDTO>(
        Endpoints.HR.LeaveRequest.getById(this.id),
      )
      .then((result) => {
        if (!result) return;
        this.form.patchValue(result);
        if (result.startTime) {
          this.onLeaveModeChange("partial");
        }
      });
  }

  loadRequestTypes() {
    this.apiResponseS
      .onGetEnumSelectItem("ELeaveType")
      .then((data: ISelectItem[]) => {
        this.requestTypes.set(data);
      });
  }

  loadExistingRequests(): void {
    this.apiResponseS
      .onGetList<LeaveRequestMyDTO[]>(Endpoints.HR.LeaveRequest.getAll)
      .then((requests) => {
        const datesToDisable: Date[] = [];
        requests.forEach((request) => {
          if (this.id && request.id === this.id) {
            return;
          }
          if (request.status === "Rejected" || request.status === "Cancelled") {
            return;
          }

          const start = this.dateS.parseDate(request.startDate);
          const end = this.dateS.parseDate(request.endDate);
          if (!start || !end) {
            return;
          }
          start.setUTCHours(0, 0, 0, 0);
          end.setUTCHours(0, 0, 0, 0);

          let currentDate = new Date(start);
          while (currentDate <= end) {
            datesToDisable.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        this.disabledDates.set(datesToDisable);
      });
  }

  onLeaveModeChange(mode: "full" | "partial"): void {
    this.leaveMode.set(mode);
    const { startTime, endTime, endDate } = this.form.controls;

    if (mode === "full") {
      startTime.clearValidators();
      endTime.clearValidators();
      startTime.setValue("");
      endTime.setValue("");
      endDate.setValidators([Validators.required]);
    } else {
      startTime.setValidators([Validators.required]);
      endTime.setValidators([Validators.required]);
      endDate.clearValidators();
      if (this.form.controls.startDate.value) {
        endDate.setValue(this.form.controls.startDate.value);
      }
    }

    startTime.updateValueAndValidity();
    endTime.updateValueAndValidity();
    endDate.updateValueAndValidity();
  }

  onFileChange(file: File): void {
    if (!file) return;
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("El archivo no debe exceder los 10 MB.");
      return;
    }
    this.selectedFile = {
      file,
      name: file.name,
      size: this.formatFileSize(file.size),
      type: file.type,
    };
  }

  removeAttachment(): void {
    this.selectedFile = null;
    const fileInput = document.querySelector(
      'input[type="file"',
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private formatDate(date: Date | string): string {
    return this.dateS.getDateFormat(date) ?? "";
  }

  onSubmit(): void {
    if (this.isPartial()) {
      const { startTime, endTime, startDate } = this.form.getRawValue();
      if (startTime && endTime && startTime >= endTime) {
        alert("La hora de inicio debe ser anterior a la hora de fin.");
        return;
      }
      this.form.controls.endDate.setValue(startDate);
    }

    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.HR.LeaveRequest.update(this.id)
        : Endpoints.HR.LeaveRequest.create,
      method: this.id ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue) => {
        const formData = new FormData();
        formData.append("leaveType", String(formValue.leaveType));
        formData.append("startDate", this.formatDate(formValue.startDate));
        formData.append("endDate", this.formatDate(formValue.endDate));
        if (formValue.startTime)
          formData.append("startTime", formValue.startTime);
        if (formValue.endTime) formData.append("endTime", formValue.endTime);
        if (formValue.reason)
          formData.append("reason", formValue.reason.trim());
        if (this.selectedFile) {
          formData.append(
            "attachmentPath",
            this.selectedFile.file,
            this.selectedFile.file.name,
          );
        }
        return formData;
      },
    });
  }
}
