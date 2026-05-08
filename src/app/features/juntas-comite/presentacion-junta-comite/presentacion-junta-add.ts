import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-presentacion-junta-add",
  templateUrl: "./presentacion-junta-add.html",
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomButtonSave,
    CustomInputTextSignal,
  ],
})
export class PresentacionJuntaAdd implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);

  submitting = signal(false);
  id: string = "";
  filePath: string = "";
  errorMessage: string = "";

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    customerId: new FormControl<string>(this.customerIdS.customerId()),
    fechaCorrespondiente: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaJunta: new FormControl<string>(""),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `PresentacionJuntaComite/Get/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      result.fechaCorrespondiente = this.dateS.getDateFormat(
        result.fechaCorrespondiente,
      );
      result.fechaJunta = this.dateS.getDateFormat(result.fechaJunta);
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    if (!this.id) {
      this.apiResponseS
        .onPost(`PresentacionJuntaComite/AddFecha`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`PresentacionJuntaComite/AddFecha/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}









