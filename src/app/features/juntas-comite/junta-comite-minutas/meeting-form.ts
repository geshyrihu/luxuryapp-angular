import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { AdministrationFormList } from "./administration-form-list";
import { ComiteForm } from "./comite-form";
import { InvitedForm } from "./invited-form";

interface IMeetingForm {
  id: FormControl<string | null>;
  date: FormControl<string>;
  eTypeMeeting: FormControl<number | null>;
  customerId: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-meeting-form",
  templateUrl: "./meeting-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    ComiteForm,
    InvitedForm,
    AdministrationFormList,
  ],
})
export class MeetingForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  formB = inject(FormBuilder);
  customerId = this.config.data.customerId;

  dateNow = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * -60 * 1000,
  )
    .toISOString()
    .slice(0, 19);
  id: string = "";
  participantInvitado: any[] = [];
  cb_typeMeeting = signal<ISelectItem[]>([]);

  form: FormGroup<IMeetingForm> = this.formB.group({
    id: [""],
    date: [this.dateNow, Validators.required],
    eTypeMeeting: [null as number | null, Validators.required],
    customerId: [this.customerId],
    applicationUserId: [this.authS.applicationUserId],
  });

  submitting = signal(false);

  ngOnInit() {
    this.enumSelectS.typeMeeting().subscribe((result: ISelectItem[]) => {
      this.cb_typeMeeting.set(result);
    });

    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    const formValue = this.form.getRawValue();
    const payload = { ...formValue };

    if (!this.id) {
      // Eliminar ID si es un registro nuevo para evitar error de conversión de Guid
      delete (payload as any).id;
      this.apiResponseS.onPost(`Meetings`, payload).then((result: any) => {
        if (result) {
          this.id = result.id;
          this.form.controls.id.setValue(this.id);
          this.onLoadData();
        }
        this.submitting.set(false);
      });
    } else {
      this.apiResponseS.onPut(`Meetings/${this.id}`, payload).then(() => {
        this.onLoadData();
        this.submitting.set(false);
      });
    }
  }

  onLoadData() {
    const urlApi = `Meetings/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
}
