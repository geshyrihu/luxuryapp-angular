import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-solicitud-vacante",
  templateUrl: "./solicitud-vacante-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, WebButtonLabelSave, CustomInputTextAreaSignal],
})
export class SolicitudVacanteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private authS = inject(AuthService);
  private enumSelectS = inject(EnumSelectService);
  workPositionId: any = this.config.data.workPositionId;

  data: any;
  submitting = signal(false);

  id: string = "";

  cb_turnoTrabajo = signal<SelectItemDto[]>([]);

  form = this.formB.nonNullable.group({
    id: [this.config.data.workPositionId],
    applicationRoleName: ["", Validators.required],
    sueldo: ["", [Validators.required, Validators.minLength(4)]],
    sueldoBase: ["", [Validators.required, Validators.minLength(4)]],
    turnoTrabajo: [null as number | null, Validators.required],
    lunesEntrada: [""],
    lunesSalida: [""],
    martesEntrada: [""],
    martesSalida: [""],
    miercolesEntrada: [""],
    miercolesSalida: [""],
    juevesEntrada: [""],
    juevesSalida: [""],
    viernesEntrada: [""],
    viernesSalida: [""],
    sabadoEntrada: [""],
    sabadoSalida: [""],
    domingoEntrada: [""],
    domingoSalida: [""],
    additionalInformation: [""],
  });

  async ngOnInit() {
    this.cb_turnoTrabajo.set(
      await firstValueFrom(this.enumSelectS.turnoTrabajo()),
    );
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.WorkPositions.getById(
      this.workPositionId,
    );
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.data = result;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        EndpointsReclutamiento.RecruitmentRequests.solicitudVacante(
          this.authS.infoUserAuth.applicationUserId,
        ),
        this.form.getRawValue(),
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
