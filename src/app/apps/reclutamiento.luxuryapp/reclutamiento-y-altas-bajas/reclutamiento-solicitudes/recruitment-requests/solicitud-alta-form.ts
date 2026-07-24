import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
@Component({
  selector: "app-solicitud-alta",
  templateUrl: "./solicitud-alta-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
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

  cb_typeContractRegister = signal<SelectItemDto[]>([]);
  cb_vacantes = signal<SelectItemDto[]>([]);

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
    const urlApi =
      EndpointsReclutamiento.RequestEmployeeRegister.getEmployeeRegister(
        this.employeeId,
        this.customerId,
      );
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
    const urlApi = EndpointsReclutamiento.RequestEmployeeRegister.getVacantes(
      this.customerId,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.cb_vacantes.set(result);
    });
  }
  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    var urlApi = EndpointsReclutamiento.RecruitmentRequests.solicitudAlta(
      this.authS.applicationUserId,
    );
    this.apiResponseS
      .onPost(urlApi, this.form.getRawValue())
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
