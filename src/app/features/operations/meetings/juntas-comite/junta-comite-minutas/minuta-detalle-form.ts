import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/web/inputs/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { MeetingSeguimientoEdit } from "./meeting-seguimiento-edit";
import { FormHelper } from "src/app/core/helpers/form-helper";

interface IMinutaDetalleForm {
  id: FormControl<string | null>;
  deliveryDate: FormControl<Date | null>;
  status: FormControl<number | null>;
  eAreaMinutasDetalles: FormControl<number | null>;
  title: FormControl<string>;
  requestService: FormControl<string>;
  meetingId: FormControl<number | null>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-minuta-detalle-form",
  templateUrl: "./minuta-detalle-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CustomButton,
    CardModule,
  ],
})
export class MinutaDetalleForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private config = inject(DynamicDialogConfig);
  private authS = inject(AuthService);
  private formB = inject(FormBuilder);
  private dateS = inject(DateService);
  private dialogHandlerS = inject(DialogHandlerService);

  // State Signals
  submitting = signal(false);
  id = signal<string>("");

  // Data Signals
  cb_estatus = signal<any[]>([
    { value: 0, label: "Pendiente" },
    { value: 1, label: "Concluido" },
    { value: 2, label: "No Autorizado" },
  ]);
  cb_area = signal<ISelectItem[]>([]);

  form: FormGroup<IMinutaDetalleForm>;

  async ngOnInit() {
    this.form = this.formB.group({
      id: new FormControl({ value: this.config.data.id, disabled: true }),
      deliveryDate: new FormControl<Date | null>(null, [Validators.required]),
      status: new FormControl(0, [Validators.required]),
      eAreaMinutasDetalles: new FormControl(this.config.data.areaResponsable, [
        Validators.required,
      ]),
      title: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      requestService: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      meetingId: new FormControl(this.config.data.meetingId),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

    // Load Catalogs
    const areas = await firstValueFrom(this.enumSelectS.areaMinutasDetalles());
    this.cb_area.set(areas);

    // Init Data
    this.id.set(this.config.data.id);

    if (this.id()) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS.onGetItem(Endpoints.MeetingsDetails.getById(this.id())).then((result: any) => {
      // Clean HTML from requestService if present
      let content = result.requestService || "";
      if (content) {
        content = content.replace(/<[^>]*>|&nbsp;/g, "");
      }
      result.requestService = content;

      this.form.patchValue(result);
      if (result.deliveryDate) {
        this.form.controls.deliveryDate.setValue(
          this.dateS.parseDate(result.deliveryDate),
        );
      }
    });
  }

  openFollowUp() {
    this.dialogHandlerS.openDialog(
      MeetingSeguimientoEdit,
      { idMeetingSeguimiento: 0, meetingDetailsId: this.id() },
      "Seguimiento de Minuta",
      this.dialogHandlerS.sizeLg,
    );
  }

  async onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeetingsDetails.base,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (payload) => {
        const normalizedPayload = {
          ...payload,
          deliveryDate: this.dateS.getDateFormat(payload.deliveryDate),
        };
        if (!this.id()) {
          normalizedPayload.id = "00000000-0000-0000-0000-000000000000";
        }
        return normalizedPayload;
      }
    });
  }
}

