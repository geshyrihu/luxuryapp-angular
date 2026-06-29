import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
@Component({
  selector: "app-solicitud-alta",
  templateUrl: "./solicitud-alta-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
})
export class SolicitudAltaForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private formB = inject(FormBuilder);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  requestPositionCandidateId: string = "";
  data: any;
  submitting = signal(false);

  cb_typeContractRegister = signal<ISelectItem[]>([]);
  cb_vacantes = signal<ISelectItem[]>([]);

  employeeId = this.config.data.employeeId;
  customerId = this.config.data.customerId;

  form = this.formB.nonNullable.group({
    positionRequestId: [null as number | null, Validators.required],
    boss: ["", Validators.required],
    candidateName: ["", Validators.required],
    customerAddress: ["", Validators.required],
    typeContractRegister: [0, Validators.required],
    employeeId: [this.config.data.employeeId, Validators.required],
    additionalInformation: [""],
  });

  async ngOnInit() {
    this.cb_typeContractRegister.set(
      await firstValueFrom(this.enumSelectS.typeContractRegister()),
    );
    this.onLoadDataVacante();
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `RequestEmployeeRegister/GetEmployeeRegister/${this.employeeId}/${this.customerId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.data = result;
      this.form.patchValue(result);
      // Override specific fields
      this.form.patchValue({
        employeeId: this.config.data.employeeId,
        positionRequestId: null, // Was "" in original, but control is number | null
      });
    });
  }

  onLoadDataVacante() {
    const urlApi = `requestemployeeregister/vacantes/${this.customerId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.cb_vacantes.set(result);
    });
  }
  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    var urlApi = `SolicitudesReclutamiento/SolicitudAlta/${this.authS.applicationUserId}`;
    this.apiResponseS
      .onPost(urlApi, this.form.getRawValue())
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}

