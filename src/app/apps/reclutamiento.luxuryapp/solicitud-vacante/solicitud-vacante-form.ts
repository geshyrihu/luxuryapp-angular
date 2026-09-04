import { CurrencyPipe } from "@angular/common";
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
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface WorkPositionDetailDTO {
  id?: string;
  applicationRoleName: string;
  sueldo: number;
  sueldoBase: number;
  turnoTrabajo?: number | null;
  lunesEntrada?: string;
  lunesSalida?: string;
  martesEntrada?: string;
  martesSalida?: string;
  miercolesEntrada?: string;
  miercolesSalida?: string;
  juevesEntrada?: string;
  juevesSalida?: string;
  viernesEntrada?: string;
  viernesSalida?: string;
  sabadoEntrada?: string;
  sabadoSalida?: string;
  domingoEntrada?: string;
  domingoSalida?: string;
  observationsWorkShift?: string;
  additionalInformation?: string;
}

@Component({
  selector: "app-solicitud-vacante",
  templateUrl: "./solicitud-vacante-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, WebButtonLabelSave, CustomInputTextAreaSignal, CurrencyPipe],
})
export class SolicitudVacanteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  workPositionId: string = this.config.data.workPositionId;

  data: WorkPositionDetailDTO | null = null;
  submitting = signal(false);

  id: string = "";

  cb_turnoTrabajo = signal<SelectItemDto[]>([]);

  form = this.formB.nonNullable.group({
    id: [this.config.data.workPositionId],
    applicationRoleName: ["", Validators.required],
    sueldo: [0 as number, [Validators.required, Validators.min(0)]],
    sueldoBase: [0 as number, [Validators.required, Validators.min(0)]],
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
    this.apiResponseS.onGetItem<WorkPositionDetailDTO>(urlApi).then((result) => {
      this.data = result;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        EndpointsReclutamiento.RecruitmentRequests.solicitudVacante(),
        this.form.getRawValue(),
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
